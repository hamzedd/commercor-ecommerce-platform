import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import OpenAI from 'openai';
import { GROQ_API_KEY, GROQ_MODEL } from '@/src/utils/environmentConstants';
import { ASSISTANT_TOOLS } from '../assistant.tools';
import {
  AssistantContentBlock,
  AssistantMessage,
  AssistantToolUseBlock,
} from '../assistant.types';
import { AssistantToolsService } from './assistantTools.service';

const SYSTEM_PROMPT = `You are the Commercor admin assistant, embedded in the staff dashboard.
- Help staff look up products, orders, customers, and sales figures.
- Always use the provided tools to look up real data - never invent prices, stock, order details, or figures.
- Call one tool at a time and wait for its result before deciding the next step.
- update_product_stock changes real data. Only call it once the staff member has clearly named the product and the exact new stock quantity - never speculatively, and never for anything other than stock quantity.
- If a tool returns a "forbidden" error, tell the staff member their role does not allow that action instead of retrying.
- Keep replies short and to the point, formatted for a chat panel.`;

const MAX_TOOL_ITERATIONS = 6;
type GroqMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

@Injectable()
export class AssistantService {
  private readonly client: OpenAI | null = GROQ_API_KEY
    ? new OpenAI({
        apiKey: GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1',
      })
    : null;

  constructor(private readonly tools: AssistantToolsService) {}

  async chat({
    messages,
    userRole,
  }: {
    messages: AssistantMessage[];
    userRole?: string;
  }): Promise<{ content: AssistantContentBlock[] }> {
    if (!this.client) {
      throw new ServiceUnavailableException('The assistant is not configured.');
    }
    const conversation: GroqMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...this.toGroqMessages(messages),
    ];

    try {
      for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
        const response = await this.client.chat.completions.create({
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
        const toolCalls = choice.message.tool_calls || [];
        if (toolCalls.length === 0) {
          return { content: this.toContentBlocks(choice.message) };
        }

        conversation.push(choice.message);
        for (const call of toolCalls) {
          const block = this.toToolUseBlock(call);
          conversation.push({
            role: 'tool',
            tool_call_id: call.id,
            content: JSON.stringify(await this.executeTool(block, userRole)),
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
    return messages.map((message) => ({
      role: message.role,
      content:
        typeof message.content === 'string'
          ? message.content
          : message.content
              .filter((block) => block.type === 'text')
              .map((block) => (block.type === 'text' ? block.text : ''))
              .join('\n'),
    }));
  }

  private toContentBlocks(
    message: OpenAI.Chat.Completions.ChatCompletionMessage,
  ): AssistantContentBlock[] {
    return message.content ? [{ type: 'text', text: message.content }] : [];
  }

  private toToolUseBlock(
    call: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  ): AssistantToolUseBlock {
    let input: Record<string, unknown> = {};
    try {
      input = JSON.parse(call.function.arguments) as Record<string, unknown>;
    } catch {
      input = {};
    }
    return { type: 'tool_use', id: call.id, name: call.function.name, input };
  }

  private async executeTool(block: AssistantToolUseBlock, userRole?: string) {
    const input = block.input;
    switch (block.name) {
      case 'search_products':
        return this.tools.searchProducts({
          query: input.query as string,
          limit: input.limit as number | undefined,
        });
      case 'get_product_details':
        return this.tools.getProductDetails({ id: input.id as string });
      case 'update_product_stock':
        return this.tools.updateProductStock(
          { id: input.id as string, stock: input.stock as number },
          userRole,
        );
      case 'list_orders':
        return this.tools.listOrders({
          status: input.status as string | undefined,
          limit: input.limit as number | undefined,
        });
      case 'get_order_details':
        return this.tools.getOrderDetails({ id: input.id as string });
      case 'get_sales_summary':
        return this.tools.getSalesSummary();
      case 'search_customers':
        return this.tools.searchCustomers({
          query: input.query as string,
          limit: input.limit as number | undefined,
        });
      default:
        return {
          error: 'unknown_tool',
          message: `Unknown tool: ${block.name}`,
        };
    }
  }
}
