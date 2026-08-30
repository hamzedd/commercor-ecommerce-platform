import LegalPageLayout from "@/src/components/pageComponents/legal/LegalPageLayout";
import { getStoreSettingsService } from "@/src/service/apiServices/storeSettings.service";

export const metadata = { title: "Refund & Returns Policy" };

const LAST_UPDATED = "2026-08-30";

export default async function RefundPolicyPage() {
  const settings = await getStoreSettingsService();
  const storeName = settings.storeName;
  const contactEmail = settings.contactEmail || "our support team";

  return (
    <LegalPageLayout title="Refund & Returns Policy" lastUpdated={LAST_UPDATED}>
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        This is a general-purpose template, not legal advice. Return/refund
        windows and conditions below are placeholders - replace them with your
        actual policy, and have it reviewed by a lawyer before relying on it for
        a live store.
      </p>

      <section>
        <h2 className="text-lg font-bold text-slate-950">
          1. Returns Eligibility
        </h2>
        <p>
          We want you to be happy with your order. If you are not satisfied,
          most items can be returned within 14 days of delivery, provided they
          are unused, in their original packaging, and in the same condition you
          received them.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">
          2. How to Request a Return
        </h2>
        <p>
          To start a return, contact us at {contactEmail} with your order number
          and the reason for the return. We will confirm whether the item is
          eligible and provide instructions for sending it back or arranging a
          pickup.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">
          3. Cash on Delivery Orders
        </h2>
        <p>
          For orders paid by cash on delivery, no payment is charged until the
          order is delivered. If you cancel before delivery, no refund is
          necessary since no payment was collected. If a return is approved
          after delivery for a cash-on-delivery order, we will arrange the
          refund with you directly (for example, by bank transfer) since no
          online payment method was used to charge the order.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">
          4. Online Payment Orders
        </h2>
        <p>
          For orders paid online, approved refunds are issued to the original
          payment method. Please allow a few business days for the refund to
          appear, depending on your payment provider.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">
          5. Damaged or Defective Items
        </h2>
        <p>
          If an item arrives damaged, defective, or different from what you
          ordered, contact us at {contactEmail} as soon as possible, ideally
          with photos of the item, so we can resolve it quickly with a
          replacement or a full refund.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">
          6. Non-Returnable Items
        </h2>
        <p>
          Some items may not be eligible for return, such as perishable goods,
          personalized products, or items marked as final sale on the product
          page.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">
          7. Order Cancellations
        </h2>
        <p>
          You may cancel an order before it has shipped by contacting us at{" "}
          {contactEmail}. Once an order has shipped, please follow the returns
          process above instead.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">8. Contact Us</h2>
        <p>
          For any questions about returns or refunds at {storeName}, please
          reach out to {contactEmail}.
        </p>
      </section>
    </LegalPageLayout>
  );
}
