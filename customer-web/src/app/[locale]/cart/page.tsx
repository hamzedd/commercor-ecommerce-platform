"use client";

import { ShoppingOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import CartItem from "@/src/components/pageComponents/cart/CartItem";
import CartOrderSummary from "@/src/components/pageComponents/cart/CartOrderSummary";
import Reveal from "@/src/components/ui/utis/reveal/Reveal";
import { Link } from "@/src/i18n/navigation";
import {
  CART_UPDATED_EVENT,
  getCart,
  syncGuestCartToServer,
} from "@/src/utils/cart/cartStorage";
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
    if (window.localStorage.getItem("accessToken")) {
      void syncGuestCartToServer().catch(() => undefined);
    }
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
    <main className="min-h-screen bg-slate-50 pb-16 text-slate-950">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0b0821] via-[#1e1147] to-[#0b1740] text-white">
        <div
          aria-hidden
          className="animate-blob-pulse animate-float-slow absolute -top-20 -right-16 h-72 w-72 rounded-full bg-violet-600/30 blur-[100px]"
        />
        <div
          aria-hidden
          className="absolute inset-0 [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.04]"
        />
        <div className="my-container relative py-8 sm:py-10 lg:py-12">
          <p className="text-xs font-bold tracking-[0.18em] text-violet-300 uppercase">
            {t("yourSelection")}
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {t("shoppingCart")}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                {t("cartDescription")}
              </p>
            </div>
            {itemCount > 0 && (
              <p
                aria-live="polite"
                className="glass-panel w-fit rounded-full px-3 py-1.5 text-sm font-semibold"
              >
                {t("cartItemCount", { count: itemCount })}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="my-container py-6 sm:py-8 lg:py-10">
        {cart.length === 0 ? (
          <section className="flex min-h-[420px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="max-w-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-2xl text-white shadow-md">
                <ShoppingOutlined aria-hidden />
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
                {t("yourCartIsEmpty")}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {t("emptyCartDescription")}
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 px-6 text-sm font-bold text-white shadow-md shadow-violet-900/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-800/30 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:outline-none"
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
              {cart.map((item, index) => (
                <CartItem
                  key={`${item.productId}:${item.variantId || ""}`}
                  productId={item.productId}
                  quantity={item.quantity}
                  variantId={item.variantId}
                  lang={locale}
                  onCartUpdate={refreshCart}
                  setProductPrices={setProductPrices}
                  style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
                />
              ))}
            </section>
            <Reveal delay={120}>
              <CartOrderSummary cart={cart} productPrices={productPrices} />
            </Reveal>
          </div>
        )}
      </div>
    </main>
  );
}

export default CartPage;
