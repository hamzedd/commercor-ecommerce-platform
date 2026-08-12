"use client";

import { LockOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import CheckoutAddressList from "@/src/components/pageComponents/checkout/CheckoutAddressList";
import { useRouter } from "@/src/i18n/navigation";
import { createOrderService, getCheckoutQuoteService } from "@/src/service/apiServices/order.service";
import { AddressType } from "@/src/utils/types/address.type";
import { CheckoutQuoteType, CreateOrderItemType } from "@/src/utils/types/order.type";
import { useStoreSettings } from "@/src/components/providers/StoreSettingsProvider";
import formatCurrency from "@/src/utils/functions/formatCurrency";

interface Props {
  cart: CreateOrderItemType[];
  lang: string;
  productPrices: Record<string, string | undefined>;
}

function CheckoutOrderSummary({ cart, productPrices, lang }: Props) {
  const t = useTranslations();
  const settings = useStoreSettings();
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<AddressType["id"]>("");
  const [quote, setQuote] = useState<CheckoutQuoteType>();
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedAddress || cart.length === 0) { setQuote(undefined); setQuoteError(undefined); return; }
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setQuoteLoading(true); setQuoteError(undefined);
      getCheckoutQuoteService({ items: cart, addressId: selectedAddress })
        .then(setQuote)
        .catch((error) => { if (!controller.signal.aborted) { setQuote(undefined); setQuoteError(error?.response?.data?.message || t("quoteError")); } })
        .finally(() => { if (!controller.signal.aborted) setQuoteLoading(false); });
    }, 250);
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [cart, selectedAddress, t]);

  const handleCheckout = async () => {
    if (!quote) return;
    try { setSubmitting(true); setQuoteError(undefined); const { paymentUrl } = await createOrderService({ items: cart, addressId: selectedAddress });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(paymentUrl as any);
    } catch (error: unknown) { const requestError = error as { response?: { data?: { message?: string } } }; setQuoteError(requestError.response?.data?.message || t("checkoutError")); setSubmitting(false); }
  };

  const totalPrice = cart.reduce((total, item) => {
    const price = productPrices[item.productId];
    return price ? total + +price * item.quantity : total;
  }, 0);

  return (
    <aside className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-28">
      <p className="text-xs font-bold tracking-[0.16em] text-amber-700 uppercase">
        {t("secureCheckout")}
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
        {t("orderSummary")}
      </h2>

      <dl className="mt-6 border-y border-stone-200 py-4">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-sm text-stone-600">{t("subtotal")}</dt>
          <dd className="text-base font-semibold text-stone-950">
            {formatCurrency(quote?.subtotal ?? totalPrice, settings.currencyCode, lang)}
          </dd>
        </div>
        <div className="mt-3 flex items-center justify-between gap-4"><dt className="text-sm text-stone-600">{t("shipping")}</dt><dd className="font-semibold text-stone-950">{quoteLoading ? t("recalculating") : quote ? formatCurrency(quote.shippingAmount, settings.currencyCode, lang) : "--"}</dd></div>
        <div className="mt-3 flex items-center justify-between gap-4"><dt className="text-sm text-stone-600">{t("tax")}</dt><dd className="font-semibold text-stone-950">{quoteLoading ? t("recalculating") : quote ? formatCurrency(quote.taxAmount, settings.currencyCode, lang) : "--"}</dd></div>
        <div className="mt-3 flex items-center justify-between gap-4 border-t border-stone-100 pt-3">
          <dt className="font-bold text-stone-950">{t("total")}</dt>
          <dd className="text-2xl font-bold tracking-tight text-stone-950">
            {quoteLoading ? t("recalculating") : formatCurrency(quote?.total ?? totalPrice, settings.currencyCode, lang)}
          </dd>
        </div>
      </dl>
      {quoteError && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{quoteError}</p>}

      <div className="mt-6">
        <CheckoutAddressList
          onAddressSelect={setSelectedAddress}
          selectedAddressId={selectedAddress}
        />
      </div>

      <button
        type="button"
        onClick={handleCheckout}
        disabled={cart.length === 0 || !selectedAddress || !quote || quoteLoading || submitting}
        className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-stone-950 px-5 text-sm font-bold text-white transition-colors duration-200 hover:bg-amber-600 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500"
      >
        <LockOutlined aria-hidden />
        {submitting ? t("processingPayment") : t("proceedToCheckout")}
      </button>

      <div className="mt-4 grid gap-2 text-xs font-medium text-stone-500 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <p className="flex items-center gap-2">
          <SafetyCertificateOutlined className="text-amber-700" aria-hidden />
          {t("secureCheckout")}
        </p>
        <p className="flex items-center gap-2">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-amber-600" />
          {t("freeReturns")}
        </p>
      </div>
    </aside>
  );
}

export default CheckoutOrderSummary;
