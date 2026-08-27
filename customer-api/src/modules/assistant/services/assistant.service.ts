import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import {
  ANTHROPIC_API_KEY,
  ANTHROPIC_MODEL,
} from '@/src/utils/environmentConstants';
import { ASSISTANT_TOOLS, CLIENT_TOOL_NAMES } from '../assistant.tools';
import { AssistantToolsService } from './assistantTools.service';

const SYSTEM_PROMPT = `You are the Commercor shopping assistant, embedded in the storefront chat widget.
- Help customers find products, compare options, and check their own order status.
- Always use the provided tools to look up real data (products, categories, orders) - never invent prices, stock, or order details.
- Call one tool at a time and wait for its result before deciding the next step.
- Before calling add_to_cart, make sure you have a concrete productId from search_products or get_product_details and the customer has confirmed they want that exact item.
- Keep replies short and conversational, formatted for a chat bubble (no long headings or markdown tables).
- If get_order_status returns a "not_authenticated" error, tell the customer to sign in instead of guessing.`;

const MAX_TOOL_ITERATIONS = 6;

export type AssistantChatResult = {
  content: Anthropic.ContentBlock[];
  stopReason: Anthropic.Message['stop_reason'];
};

@Injectable()
export class AssistantService {
  private readonly client: Anthropic | null = ANTHROPIC_API_KEY
    ? new Anthropic({ apiKey: ANTHROPIC_API_KEY })
    : null;

  constructor(private readonly tools: AssistantToolsService) {}

  async chat({
    messages,
    locale,
    customerId,
  }: {
    messages: Anthropic.MessageParam[];
    locale?: string;
    customerId?: string;
  }): Promise<AssistantChatResult> {
    if (!this.client) {
      throw new ServiceUnavailableException('The assistant is not configured.');
    }

    const conversation: Anthropic.MessageParam[] = [...messages];
    const system = locale
      ? `${SYSTEM_PROMPT}\n\nRespond in the customer's locale: ${locale}.`
      : SYSTEM_PROMPT;

    for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
      const response = await this.client.messages.create({
        model: ANTHROPIC_MODEL,
        max_tokens: 4096,
        system,
        tools: ASSISTANT_TOOLS,
        output_config: { effort: 'medium' },
        messages: conversation,
      });

      if (response.stop_reason !== 'tool_use') {
        return { content: response.content, stopReason: response.stop_reason };
      }

      const toolUseBlocks = response.content.filter(
        (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
      );

      const hasClientTool = toolUseBlocks.some((block) =>
        CLIENT_TOOL_NAMES.has(block.name),
      );
      if (hasClientTool) {
        // Hand the turn back to the frontend to execute the client-side
        // tool(s); it will resend the conversation with the tool_result(s).
        return { content: response.content, stopReason: response.stop_reason };
      }

      conversation.push({ role: 'assistant', content: response.content });

      const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
        toolUseBlocks.map(async (block) => ({
          type: 'tool_result' as const,
          tool_use_id: block.id,
          content: JSON.stringify(
            await this.executeServerTool(block, locale, customerId),
          ),
        })),
      );

      conversation.push({ role: 'user', content: toolResults });
    }

    throw new ServiceUnavailableException(
      'The assistant could not complete the request.',
    );
  }

  private async executeServerTool(
    block: Anthropic.ToolUseBlock,
    locale?: string,
    customerId?: string,
  ) {
    const input = block.input as Record<string, unknown>;
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
}
