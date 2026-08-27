import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import {
  ANTHROPIC_API_KEY,
  ANTHROPIC_MODEL,
} from '@/src/utils/environmentConstants';
import { ASSISTANT_TOOLS } from '../assistant.tools';
import { AssistantToolsService } from './assistantTools.service';

const SYSTEM_PROMPT = `You are the Commercor admin assistant, embedded in the staff dashboard.
- Help staff look up products, orders, customers, and sales figures.
- Always use the provided tools to look up real data - never invent prices, stock, order details, or figures.
- Call one tool at a time and wait for its result before deciding the next step.
- update_product_stock changes real data. Only call it once the staff member has clearly named the product and the exact new stock quantity - never speculatively, and never for anything other than stock quantity.
- If a tool returns a "forbidden" error, tell the staff member their role does not allow that action instead of retrying.
- Keep replies short and to the point, formatted for a chat panel.`;

const MAX_TOOL_ITERATIONS = 6;

@Injectable()
export class AssistantService {
  private readonly client: Anthropic | null = ANTHROPIC_API_KEY
    ? new Anthropic({ apiKey: ANTHROPIC_API_KEY })
    : null;

  constructor(private readonly tools: AssistantToolsService) {}

  async chat({
    messages,
    userRole,
  }: {
    messages: Anthropic.MessageParam[];
    userRole?: string;
  }): Promise<{ content: Anthropic.ContentBlock[] }> {
    if (!this.client) {
      throw new ServiceUnavailableException('The assistant is not configured.');
    }

    const conversation: Anthropic.MessageParam[] = [...messages];

    for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
      const response = await this.client.messages.create({
        model: ANTHROPIC_MODEL,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        tools: ASSISTANT_TOOLS,
        output_config: { effort: 'medium' },
        messages: conversation,
      });

      if (response.stop_reason !== 'tool_use') {
        return { content: response.content };
      }

      const toolUseBlocks = response.content.filter(
        (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
      );

      conversation.push({ role: 'assistant', content: response.content });

      const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
        toolUseBlocks.map(async (block) => ({
          type: 'tool_result' as const,
          tool_use_id: block.id,
          content: JSON.stringify(await this.executeTool(block, userRole)),
        })),
      );

      conversation.push({ role: 'user', content: toolResults });
    }

    throw new ServiceUnavailableException(
      'The assistant could not complete the request.',
    );
  }

  private async executeTool(block: Anthropic.ToolUseBlock, userRole?: string) {
    const input = block.input as Record<string, unknown>;
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
