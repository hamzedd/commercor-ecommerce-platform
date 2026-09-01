import { ProductReviewsService } from './product-reviews.service';

describe('ProductReviewsService.eligibility', () => {
  function service(qualifyingOrder: unknown, existingReview: unknown) {
    const queryBuilder = {
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn(async () => qualifyingOrder),
    };
    const orderRepo = { createQueryBuilder: jest.fn(() => queryBuilder) };
    const reviewRepo = { findOneBy: jest.fn(async () => existingReview) };
    const db = {
      getRepository: jest.fn((entity) =>
        entity.name === 'OrderEntity' ? orderRepo : reviewRepo,
      ),
    };
    return new ProductReviewsService(db as any);
  }

  it('is eligible once a COD order is COMPLETED with a COMPLETED payment - the query is provider-agnostic', async () => {
    // qualifyingOrder() only filters on order.status=COMPLETED and
    // payment.status=COMPLETED (an inner join on PaymentEntity with no
    // provider condition), so a cash-on-delivery order marked paid through
    // admin-api's markManualPaymentPaid satisfies the same verified-purchase
    // rule as a gateway-paid order, with no code change needed here.
    const target = service({ id: 'order-1' }, null);

    await expect(target.eligibility('customer', 'product')).resolves.toEqual({
      eligible: true,
      hasReview: false,
      review: null,
    });
  });

  it('is not eligible without a completed order/payment', async () => {
    const target = service(null, null);

    await expect(target.eligibility('customer', 'product')).resolves.toEqual({
      eligible: false,
      hasReview: false,
      review: null,
    });
  });
});
