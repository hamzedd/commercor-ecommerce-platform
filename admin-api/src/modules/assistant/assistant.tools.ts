import type { AssistantTool } from './assistant.types';

/**
 * All tools here are executed server-side (unlike the customer-web
 * assistant, the admin dashboard has no client-only state to hand tool
 * calls back to) - see assistantTools.service.ts for the implementations.
 */
export const ASSISTANT_TOOLS: AssistantTool[] = [
  {
    name: 'search_products',
    description: 'Search the product catalog by name.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Keywords to search for' },
        limit: {
          type: 'integer',
          description: 'Max results to return (default 10, max 25)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_product_details',
    description: 'Get full details for one product by its id.',
    input_schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'The product id' },
      },
      required: ['id'],
    },
  },
  {
    name: 'update_product_stock',
    description:
      "Set a product's stock quantity. Only call this once the staff member has clearly confirmed the product and the new quantity. Restricted to the ADMIN role, same as the inventory management page.",
    input_schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'The product id' },
        stock: { type: 'integer', description: 'The new stock quantity' },
      },
      required: ['id', 'stock'],
    },
  },
  {
    name: 'list_orders',
    description:
      'List recent orders, optionally filtered by status (e.g. "completed", "pending").',
    input_schema: {
      type: 'object',
      properties: {
        status: { type: 'string', description: 'Order status to filter by' },
        limit: {
          type: 'integer',
          description: 'Max results to return (default 10, max 25)',
        },
      },
    },
  },
  {
    name: 'get_order_details',
    description:
      'Get full details (items, customer, address) for one order by its id.',
    input_schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'The order id' },
      },
      required: ['id'],
    },
  },
  {
    name: 'get_sales_summary',
    description:
      'Get an aggregate sales summary (order count, revenue, average order value, status breakdown) across all orders.',
    input_schema: { type: 'object', properties: {} },
  },
  {
    name: 'search_customers',
    description: 'Search customers by name, username, or email.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Keywords to search for' },
        limit: {
          type: 'integer',
          description: 'Max results to return (default 10, max 25)',
        },
      },
      required: ['query'],
    },
  },
];
