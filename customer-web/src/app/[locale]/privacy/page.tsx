import LegalPageLayout from "@/src/components/pageComponents/legal/LegalPageLayout";
import { getStoreSettingsService } from "@/src/service/apiServices/storeSettings.service";

export const metadata = { title: "Privacy Policy" };

const LAST_UPDATED = "2026-08-30";

export default async function PrivacyPage() {
  const settings = await getStoreSettingsService();
  const storeName = settings.storeName;
  const contactEmail = settings.contactEmail || "our support team";

  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated={LAST_UPDATED}>
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        This is a general-purpose template, not legal advice. Have it reviewed
        by a lawyer familiar with your country/state (and any applicable privacy
        laws, such as GDPR or CCPA) before relying on it for a live store.
      </p>

      <section>
        <h2 className="text-lg font-bold text-slate-950">
          1. Information We Collect
        </h2>
        <p>
          When you create an account, browse our store, or place an order, we
          may collect the following information:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            Contact details: name, email address, phone number, and delivery
            address.
          </li>
          <li>Account details: username and encrypted password.</li>
          <li>
            Order details: items purchased, order history, and (where an online
            payment provider is used) payment confirmation details - we do not
            store your full card number.
          </li>
          <li>
            Usage data: pages visited and general interaction with the Site,
            collected automatically.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">
          2. How We Use Your Information
        </h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Process and fulfill your orders, including delivery.</li>
          <li>
            Communicate with you about your orders, account, or customer support
            requests.
          </li>
          <li>Improve and personalize your shopping experience.</li>
          <li>Detect and prevent fraud or abuse of the Site.</li>
          <li>
            Comply with legal obligations, such as tax and accounting
            requirements.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">3. Cookies</h2>
        <p>
          We use cookies and similar technologies to keep you signed in,
          remember your cart, and understand how the Site is used. You can
          control cookies through your browser settings, though disabling them
          may affect Site functionality.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">
          4. Sharing Your Information
        </h2>
        <p>We do not sell your personal information. We may share it with:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            Payment processors, solely to process online payments when you
            choose that option at checkout.
          </li>
          <li>Delivery partners, to fulfill and deliver your order.</li>
          <li>
            Service providers who help us operate the Site (such as hosting and
            email delivery), under confidentiality obligations.
          </li>
          <li>Authorities, where required by law.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">5. Data Security</h2>
        <p>
          We take reasonable technical and organizational measures to protect
          your information, including encrypting passwords and restricting
          access to personal data. No method of transmission or storage is
          completely secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">6. Your Rights</h2>
        <p>
          Depending on where you live, you may have the right to access,
          correct, or delete your personal information, or to object to or
          restrict certain processing. You can review and update most of your
          account information directly from your profile, or contact us to make
          a request.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">
          7. Children&apos;s Privacy
        </h2>
        <p>
          The Site is not directed at children, and we do not knowingly collect
          personal information from anyone under the age of 16.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">
          8. Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. Changes take
          effect once posted on this page.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-950">9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or how {storeName}{" "}
          handles your information, please contact {contactEmail}.
        </p>
      </section>
    </LegalPageLayout>
  );
}
