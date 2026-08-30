import LegalPageLayout from "@/src/components/pageComponents/legal/LegalPageLayout";
import { getStoreSettingsService } from "@/src/service/apiServices/storeSettings.service";

export const metadata = { title: "Terms of Service" };

const LAST_UPDATED = "2026-08-30";

export default async function TermsPage() {
  const settings = await getStoreSettingsService();
  const storeName = settings.storeName;
  const contactEmail = settings.contactEmail || "our support team";

  return (
    <LegalPageLayout title="Terms of Service" lastUpdated={LAST_UPDATED}>
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        This is a general-purpose template, not legal advice. Have it reviewed
        by a lawyer familiar with your country/state before relying on it for a
        live store.
      </p>

      <section>
        <h2 className="text-lg font-bold text-slate-950">
          1. Acceptance of these Terms
        </h2>
        <p>
          By accessing or using this website (the &quot;Site&quot;), operated by{" "}
          {storeName}, you agree to be bound by these Terms of Service. If you
          do not agree to these terms, please do not use the Site.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">2. Accounts</h2>
        <p>
          When you create an account with us, you must provide accurate and
          complete information. You are responsible for safeguarding your
          password and for any activity that occurs under your account. Notify
          us immediately of any unauthorized use of your account.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">
          3. Orders and Payment
        </h2>
        <p>
          When you place an order, you are making an offer to purchase the
          product(s) at the listed price. We reserve the right to accept or
          decline any order for any reason, including product availability,
          errors in pricing or product information, or suspected fraud.
        </p>
        <p>
          Depending on the payment method available at checkout, payment is
          either collected online at the time of purchase, or collected in
          person at the time of delivery (cash on delivery). Prices are shown in
          the currency displayed at checkout and do not include applicable taxes
          or shipping unless stated otherwise.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">
          4. Pricing and Product Information
        </h2>
        <p>
          We attempt to be as accurate as possible in describing products and
          pricing. However, we do not warrant that product descriptions,
          pricing, or other content on the Site is accurate, complete, reliable,
          or error-free. If a product is listed at an incorrect price due to a
          typographical or system error, we reserve the right to cancel the
          order.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">
          5. Intellectual Property
        </h2>
        <p>
          All content on the Site, including text, graphics, logos, and images,
          is the property of {storeName} or its content suppliers and is
          protected by applicable intellectual property laws. You may not
          reproduce, distribute, or create derivative works from this content
          without our prior written consent.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">6. Prohibited Uses</h2>
        <p>You agree not to use the Site to:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Violate any applicable law or regulation.</li>
          <li>
            Infringe upon the intellectual property or other rights of others.
          </li>
          <li>
            Transmit any harmful code, or attempt to interfere with the proper
            functioning of the Site.
          </li>
          <li>
            Attempt to gain unauthorized access to any part of the Site or its
            related systems.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">
          7. Limitation of Liability
        </h2>
        <p>
          To the fullest extent permitted by law, {storeName} shall not be
          liable for any indirect, incidental, special, consequential, or
          punitive damages arising out of or related to your use of the Site or
          any products purchased through it.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">
          8. Changes to These Terms
        </h2>
        <p>
          We may update these Terms of Service from time to time. Changes take
          effect once posted on this page. Continued use of the Site after
          changes are posted constitutes acceptance of the revised terms.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">9. Contact Us</h2>
        <p>
          If you have any questions about these Terms of Service, please contact{" "}
          {contactEmail}.
        </p>
      </section>
    </LegalPageLayout>
  );
}
