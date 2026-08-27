import type Anthropic from '@anthropic-ai/sdk';

/**
 * Tools the assistant can call. Server tools (read data) are executed here in
 * assistant.service.ts. Client tools mutate frontend-only state (the cart
 * lives in localStorage, not the API) or navigate the browser, so the backend
 * hands the tool_use block back to the frontend to execute and continue the
 * conversation with the tool_result on the next request.
 */
export const CLIENT_TOOL_NAMES = new Set([
  'add_to_cart',
  'view_product',
  'view_category',
]);

export const ASSISTANT_TOOLS: Anthropic.Tool[] = [
  {
    name: 'search_products',
    description:
      'Search the Commercor catalog by keyword (matches product names). Use this to find products before recommending or adding anything to the cart.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Keywords to search for, e.g. "running shoes"',
        },
        limit: {
          type: 'integer',
          description: 'Max results to return (default 6, max 15)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_product_details',
    description:
      'Get full details (description, price, stock) for one product by its slug. Use after search_products to answer detailed questions about a specific product.',
    input_schema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'The product slug' },
      },
      required: ['slug'],
    },
  },
  {
    name: 'list_categories',
    description: "List the store's product categories.",
    input_schema: { type: 'object', properties: {} },
  },
  {
    name: 'get_order_status',
    description:
      "Get the signed-in customer's recent orders and their status. Returns an error if the customer is not logged in.",
    input_schema: { type: 'object', properties: {} },
  },
  {
    name: 'add_to_cart',
    description:
      "Add a product to the shopping cart, executed in the customer's browser. Only call this for a specific product (by id) the customer has confirmed they want, never speculatively.",
    input_schema: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          description:
            'The product id (from search_products or get_product_details)',
        },
        quantity: {
          type: 'integer',
          description: 'Quantity to add, default 1',
        },
      },
      required: ['productId'],
    },
  },
  {
    name: 'view_product',
    description: "Navigate the customer's browser to a product page.",
    input_schema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'The product slug' },
      },
      required: ['slug'],
    },
  },
  {
    name: 'view_category',
    description: "Navigate the customer's browser to a category listing page.",
    input_schema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'The category slug' },
      },
      required: ['slug'],
    },
  },
];
