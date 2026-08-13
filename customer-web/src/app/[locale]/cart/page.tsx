"use client";

import { ShoppingOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import CartItem from "@/src/components/pageComponents/cart/CartItem";
import CartOrderSummary from "@/src/components/pageComponents/cart/CartOrderSummary";
import { Link } from "@/src/i18n/navigation";
import { CART_UPDATED_EVENT, getCart, syncGuestCartToServer } from "@/src/utils/cart/cartStorage";
import { CreateOrderItemType } from "@/src/utils/types/order.type";
import { ProductType } from "@/src/utils/types/product.type";

function CartPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [cart, setCart] = useState<CreateOrderItemType[]>([]);
  const [productPrices, setProductPrices] = useState<
    Record<ProductType["id"], ProductType["price"]>
  >({});

  const refreshCart = useCallback(() => setCart(getCart()), []);

  useEffect(() => {
    if (window.localStorage.getItem('accessToken')) void syncGuestCartToServer();
    const initialRead = window.setTimeout(refreshCart, 0);
    window.addEventListener(CART_UPDATED_EVENT, refreshCart);
    window.addEventListener("storage", refreshCart);
    return () => {
      window.clearTimeout(initialRead);
      window.removeEventListener(CART_UPDATED_EVENT, refreshCart);
      window.removeEventListener("storage", refreshCart);
    };
  }, [refreshCart]);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <main className="min-h-screen bg-stone-50 pb-16 text-stone-950">
      <section className="border-b border-white/10 bg-stone-950 text-white">
        <div className="my-container py-8 sm:py-10 lg:py-12">
          <p className="text-xs font-bold tracking-[0.18em] text-amber-300 uppercase">
            {t("yourSelection")}
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {t("shoppingCart")}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-300 sm:text-base">
                {t("cartDescription")}
              </p>
            </div>
            {itemCount > 0 && (
              <p
                aria-live="polite"
                className="w-fit rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-semibold"
              >
                {t("cartItemCount", { count: itemCount })}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="my-container py-6 sm:py-8 lg:py-10">
        {cart.length === 0 ? (
          <section className="flex min-h-[420px] items-center justify-center rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
            <div className="max-w-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-2xl text-amber-800">
                <ShoppingOutlined aria-hidden />
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight">
                {t("yourCartIsEmpty")}
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {t("emptyCartDescription")}
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-stone-950 px-6 text-sm font-bold text-white transition-colors hover:bg-amber-600 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {t("continueShopping")}
              </Link>
            </div>
          </section>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
            <section
              aria-label={t("cartItems")}
              className="min-w-0 space-y-3 sm:space-y-4"
            >
              {cart.map((item) => (
                <CartItem
                  key={`${item.productId}:${item.variantId||''}`}
                  productId={item.productId}
                  quantity={item.quantity}
                  variantId={item.variantId}
                  lang={locale}
                  onCartUpdate={refreshCart}
                  setProductPrices={setProductPrices}
                />
              ))}
            </section>
            <CartOrderSummary cart={cart} productPrices={productPrices} />
          </div>
        )}
      </div>
    </main>
  );
}

export default CartPage;
