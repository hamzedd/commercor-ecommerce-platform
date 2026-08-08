"use client";

import { LockOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

import { Link } from "@/src/i18n/navigation";
import { CreateOrderItemType } from "@/src/utils/types/order.type";
import { ProductType } from "@/src/utils/types/product.type";

interface Props {
  cart: CreateOrderItemType[];
  productPrices: Record<ProductType["id"], ProductType["price"]>;
}

function CartOrderSummary({ cart, productPrices }: Props) {
  const t = useTranslations();
  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(productPrices[item.productId] || 0) * item.quantity,
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
            ${subtotal.toFixed(2)}
          </dd>
        </div>
      </dl>

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
