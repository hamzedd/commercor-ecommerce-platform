import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { GROQ_API_KEY, GROQ_MODEL } from '@/src/utils/environmentConstants';
import { ASSISTANT_TOOLS, CLIENT_TOOL_NAMES } from '../assistant.tools';
import {
  AssistantContentBlock,
  AssistantMessage,
  AssistantToolUseBlock,
} from '../assistant.types';
import { AssistantToolsService } from './assistantTools.service';

const SYSTEM_PROMPT = `You are the Commercor shopping assistant, embedded in the storefront chat widget.
- Help customers find products, compare options, and check their own order status.
- Always use the provided tools to look up real data (products, categories, orders) - never invent prices, stock, or order details.
- Call one tool at a time and wait for its result before deciding the next step.
- Before calling add_to_cart, make sure you have a concrete productId from search_products or get_product_details and the customer has confirmed they want that exact item.
- Keep replies short and conversational, formatted for a chat bubble (no long headings or markdown tables).
- If get_order_status returns a "not_authenticated" error, tell the customer to sign in instead of guessing.`;

const MAX_TOOL_ITERATIONS = 6;
type GroqToolCall = {
  id: string;
  function: { name: string; arguments: string };
};
type GroqMessage = {
  role: string;
  content?: string | null;
  tool_calls?: GroqToolCall[];
  tool_call_id?: string;
};
type GroqCompletion = {
  choices: { message: GroqMessage; finish_reason: string | null }[];
};

export type AssistantChatResult = {
  content: AssistantContentBlock[];
  stopReason: string | null;
};

@Injectable()
export class AssistantService {
  constructor(private readonly tools: AssistantToolsService) {}

  async chat({
    messages,
    locale,
    customerId,
  }: {
    messages: AssistantMessage[];
    locale?: string;
    customerId?: string;
  }): Promise<AssistantChatResult> {
    if (!GROQ_API_KEY) {
      throw new ServiceUnavailableException('The assistant is not configured.');
    }

    const system = locale
      ? `${SYSTEM_PROMPT}\n\nRespond in the customer's locale: ${locale}.`
      : SYSTEM_PROMPT;
    const conversation: GroqMessage[] = [
      { role: 'system', content: system },
      ...this.toGroqMessages(messages),
    ];

    try {
      for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
        const response = await this.createCompletion({
          model: GROQ_MODEL,
          max_tokens: 4096,
          tools: ASSISTANT_TOOLS.map((tool) => ({
            type: 'function' as const,
            function: {
              name: tool.name,
              description: tool.description,
              parameters: tool.input_schema,
            },
          })),
          tool_choice: 'auto',
          parallel_tool_calls: false,
          messages: conversation,
        });
        const choice = response.choices[0];
        if (!choice) throw new Error('Groq returned no completion choice');

        const content = this.toContentBlocks(choice.message);
        const toolCalls = choice.message.tool_calls || [];
        if (toolCalls.length === 0) {
          return { content, stopReason: choice.finish_reason };
        }

        if (
          toolCalls.some((call) => CLIENT_TOOL_NAMES.has(call.function.name))
        ) {
          return { content, stopReason: 'tool_use' };
        }

        conversation.push(choice.message);
        for (const call of toolCalls) {
          const block = this.toToolUseBlock(call);
          conversation.push({
            role: 'tool',
            tool_call_id: call.id,
            content: JSON.stringify(
              await this.executeServerTool(block, locale, customerId),
            ),
          });
        }
      }
    } catch {
      throw new ServiceUnavailableException(
        'The assistant is temporarily unavailable. Please try again.',
      );
    }

    throw new ServiceUnavailableException(
      'The assistant could not complete the request.',
    );
  }

  private toGroqMessages(messages: AssistantMessage[]): GroqMessage[] {
    const result: GroqMessage[] = [];
    for (const message of messages) {
      if (typeof message.content === 'string') {
        result.push({ role: message.role, content: message.content });
        continue;
      }
      const text = message.content
        .filter((block) => block.type === 'text')
        .map((block) => (block.type === 'text' ? block.text : ''))
        .join('\n');
      const toolUses = message.content.filter(
        (block): block is AssistantToolUseBlock => block.type === 'tool_use',
      );
      if (message.role === 'assistant') {
        result.push({
          role: 'assistant',
          content: text || null,
          tool_calls: toolUses.map((block) => ({
            id: block.id,
            type: 'function' as const,
            function: {
              name: block.name,
              arguments: JSON.stringify(block.input),
            },
          })),
        });
      } else {
        if (text) result.push({ role: 'user', content: text });
        for (const block of message.content) {
          if (block.type === 'tool_result') {
            result.push({
              role: 'tool',
              tool_call_id: block.tool_use_id,
              content: block.content,
            });
          }
        }
      }
    }
    return result;
  }

  private toContentBlocks(message: GroqMessage): AssistantContentBlock[] {
    const content: AssistantContentBlock[] = [];
    if (message.content) content.push({ type: 'text', text: message.content });
    for (const call of message.tool_calls || []) {
      content.push(this.toToolUseBlock(call));
    }
    return content;
  }

  private toToolUseBlock(call: GroqToolCall): AssistantToolUseBlock {
    let input: Record<string, unknown> = {};
    try {
      input = JSON.parse(call.function.arguments) as Record<string, unknown>;
    } catch {
      input = {};
    }
    return { type: 'tool_use', id: call.id, name: call.function.name, input };
  }

  private async executeServerTool(
    block: AssistantToolUseBlock,
    locale?: string,
    customerId?: string,
  ) {
    const input = block.input;
    switch (block.name) {
      case 'search_products':
        return this.tools.searchProducts(
          {
            query: input.query as string,
            limit: input.limit as number | undefined,
          },
          locale,
        );
      case 'get_product_details':
        return this.tools.getProductDetails(
          { slug: input.slug as string },
          locale,
        );
      case 'list_categories':
        return this.tools.listCategories(locale);
      case 'get_order_status':
        return this.tools.getOrderStatus(customerId, locale);
      default:
        return {
          error: 'unknown_tool',
          message: `Unknown tool: ${block.name}`,
        };
    }
  }

  private async createCompletion(body: object): Promise<GroqCompletion> {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );
    if (!response.ok) throw new Error('Groq request failed');
    return (await response.json()) as GroqCompletion;
  }
}
