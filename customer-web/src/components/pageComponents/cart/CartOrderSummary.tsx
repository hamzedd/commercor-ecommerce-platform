"use client";

import { LockOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Link } from "@/src/i18n/navigation";
import { CreateOrderItemType } from "@/src/utils/types/order.type";
import { ProductType } from "@/src/utils/types/product.type";
import { useStoreSettings } from "@/src/components/providers/StoreSettingsProvider";
import formatCurrency from "@/src/utils/functions/formatCurrency";

interface Props {
  cart: CreateOrderItemType[];
  productPrices: Record<ProductType["id"], ProductType["price"]>;
}

function CartOrderSummary({ cart, productPrices }: Props) {
  const t = useTranslations();
  const settings = useStoreSettings();
  const [couponCode,setCouponCode]=useState("");
  useEffect(()=>setCouponCode(window.sessionStorage.getItem("commercor-coupon")||""),[]);
  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(productPrices[`${item.productId}:${item.variantId||''}`] || 0) * item.quantity,
    0,
  );

  return (
    <aside className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-28">
      <p className="text-xs font-bold tracking-[0.16em] text-amber-700 uppercase">
        {t("cartSummary")}
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
        {t("orderSummary")}
      </h2>

      <dl className="mt-6 border-y border-stone-200 py-4">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-sm text-stone-600">{t("subtotal")}</dt>
          <dd className="text-xl font-bold text-stone-950">
            {formatCurrency(subtotal, settings.currencyCode)}
          </dd>
        </div>
      </dl>
      <div className="mt-5 rounded-xl bg-stone-50 p-4"><label htmlFor="cart-coupon" className="text-sm font-semibold">{t("couponCode")}</label><div className="mt-2 flex gap-2"><input id="cart-coupon" value={couponCode} onChange={e=>setCouponCode(e.target.value.toUpperCase())} placeholder={t("couponCode")} className="min-w-0 flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm"/><button type="button" onClick={()=>window.sessionStorage.setItem("commercor-coupon",couponCode.trim().toUpperCase())} className="rounded-lg bg-stone-900 px-3 text-sm font-bold text-white">{t("applyCoupon")}</button></div>{couponCode&&<button type="button" onClick={()=>{setCouponCode("");window.sessionStorage.removeItem("commercor-coupon")}} className="mt-2 text-sm font-semibold text-red-700">{t("removeCoupon")}</button>}<p className="mt-2 text-xs text-stone-500">{t("couponValidatedAtCheckout")}</p></div>

      <Link
        href="/checkout"
        className="mt-5 flex min-h-12 w-full items-center justify-center rounded-xl bg-stone-950 px-5 text-sm font-bold text-white transition-colors duration-200 hover:bg-amber-600 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {t("proceedToCheckout")}
      </Link>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-stone-500">
        <LockOutlined aria-hidden />
        {t("secureCheckout")}
      </div>
      <Link
        href="/"
        className="mt-4 flex min-h-11 items-center justify-center rounded-xl text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
      >
        {t("continueShopping")}
      </Link>
    </aside>
  );
}

export default CartOrderSummary;
