"use client";

import { LockOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import CheckoutAddressList from "@/src/components/pageComponents/checkout/CheckoutAddressList";
import { useRouter } from "@/src/i18n/navigation";
import {
  createOrderService,
  getCheckoutQuoteService,
} from "@/src/service/apiServices/order.service";
import { AddressType } from "@/src/utils/types/address.type";
import {
  CheckoutQuoteType,
  CreateOrderItemType,
} from "@/src/utils/types/order.type";
import { useStoreSettings } from "@/src/components/providers/StoreSettingsProvider";
import formatCurrency from "@/src/utils/functions/formatCurrency";
import { getRewardsService } from "@/src/service/apiServices/rewards.service";
import { Input, InputNumber } from "antd";
import PayPalPaymentButton from "./PayPalPaymentButton";
import {
  initializePaymentService,
  PaymentInitialization,
} from "@/src/service/apiServices/payment.service";

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
  const [pendingPayment, setPendingPayment] = useState<{
    id: string;
    url: string;
    initialization: PaymentInitialization;
  }>();
  const [usePoints, setUsePoints] = useState(0);
  const [useCashback, setUseCashback] = useState(0);
  const [couponInput, setCouponInput] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [rewards, setRewards] = useState<{
    pointsBalance: number;
    cashbackBalance: number;
    pointsEnabled: boolean;
    cashbackEnabled: boolean;
  }>();
  useEffect(() => {
    const stored=window.sessionStorage.getItem("commercor-coupon")||""; setCouponInput(stored); setCouponCode(stored);
    getRewardsService()
      .then(setRewards)
      .catch(() => setRewards(undefined));
  }, []);

  useEffect(() => {
    if (!selectedAddress || cart.length === 0) {
      setQuote(undefined);
      setQuoteError(undefined);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setQuoteLoading(true);
      setQuoteError(undefined);
      getCheckoutQuoteService({
        items: cart,
        addressId: selectedAddress,
        usePoints,
        useCashback,
        couponCode: couponCode || undefined,
      })
        .then(setQuote)
        .catch((error) => {
          if (!controller.signal.aborted) {
            setQuote(undefined);
            setQuoteError(error?.response?.data?.message || t("quoteError"));
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setQuoteLoading(false);
        });
    }, 250);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [cart, selectedAddress, usePoints, useCashback, couponCode, t]);

  const handleCheckout = async () => {
    if (!quote) return;
    try {
      setSubmitting(true);
      setQuoteError(undefined);
      const { paymentUrl, paymentId } = await createOrderService({
        items: cart,
        addressId: selectedAddress,
        usePoints,
        useCashback,
        couponCode: couponCode || undefined,
      });
      const initialization = await initializePaymentService(paymentId);
      setPendingPayment({ id: paymentId, url: paymentUrl, initialization });
      setSubmitting(false);
    } catch (error: unknown) {
      const requestError = error as {
        response?: { data?: { message?: string } };
      };
      setQuoteError(requestError.response?.data?.message || t("checkoutError"));
      setSubmitting(false);
    }
  };

  const totalPrice = cart.reduce((total, item) => {
    const price = productPrices[`${item.productId}:${item.variantId||''}`];
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
            {formatCurrency(
              quote?.subtotal ?? totalPrice,
              settings.currencyCode,
              lang,
            )}
          </dd>
        </div>
        {quote && quote.pointsDiscount > 0 && (
          <div className="mt-3 flex justify-between text-sm text-emerald-700">
            <dt>Points discount</dt>
            <dd>
              -
              {formatCurrency(
                quote.pointsDiscount,
                settings.currencyCode,
                lang,
              )}
            </dd>
          </div>
        )}
        {quote && quote.couponDiscount > 0 && <div className="mt-3 flex justify-between text-sm text-emerald-700"><dt>{t("couponDiscount")} ({quote.couponCode})</dt><dd>-{formatCurrency(quote.couponDiscount,settings.currencyCode,lang)}</dd></div>}
        {quote && quote.cashbackUsed > 0 && (
          <div className="mt-3 flex justify-between text-sm text-emerald-700">
            <dt>Cashback used</dt>
            <dd>
              -{formatCurrency(quote.cashbackUsed, settings.currencyCode, lang)}
            </dd>
          </div>
        )}
        <div className="mt-3 flex items-center justify-between gap-4">
          <dt className="text-sm text-stone-600">{t("shipping")}</dt>
          <dd className="font-semibold text-stone-950">
            {quoteLoading
              ? t("recalculating")
              : quote
                ? formatCurrency(
                    quote.shippingAmount,
                    settings.currencyCode,
                    lang,
                  )
                : "--"}
          </dd>
        </div>
        <div className="mt-3 flex items-center justify-between gap-4">
          <dt className="text-sm text-stone-600">{t("tax")}</dt>
          <dd className="font-semibold text-stone-950">
            {quoteLoading
              ? t("recalculating")
              : quote
                ? formatCurrency(quote.taxAmount, settings.currencyCode, lang)
                : "--"}
          </dd>
        </div>
        <div className="mt-3 flex items-center justify-between gap-4 border-t border-stone-100 pt-3">
          <dt className="font-bold text-stone-950">{t("total")}</dt>
          <dd className="text-2xl font-bold tracking-tight text-stone-950">
            {quoteLoading
              ? t("recalculating")
              : formatCurrency(
                  quote?.total ?? totalPrice,
                  settings.currencyCode,
                  lang,
                )}
          </dd>
        </div>
      </dl>
      <div className="mt-5 rounded-xl bg-stone-50 p-4"><label className="text-sm font-semibold" htmlFor="coupon-code">{t("couponCode")}</label><div className="mt-2 flex gap-2"><Input id="coupon-code" value={couponInput} placeholder={t("couponCode")} onChange={e=>setCouponInput(e.target.value.toUpperCase())}/><button type="button" className="rounded-lg bg-stone-900 px-4 text-sm font-bold text-white disabled:bg-stone-300" disabled={!couponInput.trim()||couponInput.trim()===couponCode} onClick={()=>{const code=couponInput.trim().toUpperCase();window.sessionStorage.setItem("commercor-coupon",code);setCouponCode(code)}}>{t("applyCoupon")}</button></div>{couponCode&&<button type="button" className="mt-2 text-sm font-semibold text-red-700" onClick={()=>{window.sessionStorage.removeItem("commercor-coupon");setCouponInput("");setCouponCode("")}}>{t("removeCoupon")}</button>}</div>
      {rewards && (rewards.pointsEnabled || rewards.cashbackEnabled) && (
        <div className="mt-5 space-y-3 rounded-xl bg-stone-50 p-4">
          {rewards.pointsEnabled && rewards.pointsBalance > 0 && (
            <label className="block text-sm font-semibold">
              Use points{" "}
              <span className="font-normal text-stone-500">
                ({rewards.pointsBalance.toLocaleString(lang)} {t("available")})
              </span>
              <InputNumber
                min={0}
                max={rewards.pointsBalance}
                precision={0}
                value={usePoints}
                onChange={(v) => setUsePoints(Number(v || 0))}
                className="mt-2 w-full"
              />
            </label>
          )}
          {rewards.cashbackEnabled && rewards.cashbackBalance > 0 && (
            <label className="block text-sm font-semibold">
              Use cashback{" "}
              <span className="font-normal text-stone-500">
                (
                {formatCurrency(
                  rewards.cashbackBalance,
                  settings.currencyCode,
                  lang,
                )}{" "}
                available)
              </span>
              <InputNumber
                min={0}
                max={rewards.cashbackBalance}
                precision={2}
                value={useCashback}
                onChange={(v) => setUseCashback(Number(v || 0))}
                className="mt-2 w-full"
              />
            </label>
          )}
        </div>
      )}
      {quoteError && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700"
        >
          {quoteError}
        </p>
      )}

      <div className="mt-6">
        <CheckoutAddressList
          onAddressSelect={setSelectedAddress}
          selectedAddressId={selectedAddress}
        />
      </div>

      {!pendingPayment && (
        <button
          type="button"
          onClick={handleCheckout}
          disabled={
            cart.length === 0 ||
            !selectedAddress ||
            !quote ||
            quoteLoading ||
            submitting
          }
          className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-stone-950 px-5 text-sm font-bold text-white transition-colors duration-200 hover:bg-amber-600 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500"
        >
          <LockOutlined aria-hidden />
          {submitting ? t("processingPayment") : t("proceedToCheckout")}
        </button>
      )}
      {pendingPayment?.initialization.provider === "paypal" && (
        <PayPalPaymentButton
          paymentId={pendingPayment.id}
          initialization={pendingPayment.initialization}
          onCompleted={() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            router.push(pendingPayment.url as any);
          }}
          onError={setQuoteError}
        />
      )}

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
