"use client";

import { LockOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { use, useEffect, useState } from "react";

import CheckoutOrderSummary from "@/src/components/pageComponents/checkout/CheckoutOrderSummary";
import CheckoutPageProduct from "@/src/components/pageComponents/checkout/CheckoutPageProduct";
import { Link } from "@/src/i18n/navigation";
import { CreateOrderItemType } from "@/src/utils/types/order.type";
import { ProductType } from "@/src/utils/types/product.type";

interface Props {
  params: Promise<{ locale: string }>;
}

function Page({ params }: Props) {
  const t = useTranslations();
  const { locale } = use(params);
  const [cart, setCart] = useState<CreateOrderItemType[]>([]);
  const [productPrices, setProductPrices] = useState<
    Record<ProductType["id"], ProductType["price"]>
  >({});

  useEffect(() => {
    const initialRead = window.setTimeout(() => {
      try {
        const savedCart = JSON.parse(
          localStorage.getItem("cart") || "[]",
        ) as CreateOrderItemType[];
        setCart(savedCart);
      } catch {
        setCart([]);
      }
    }, 0);

    return () => window.clearTimeout(initialRead);
  }, []);

  const handleCartUpdate = () => {
    try {
      const updatedCart = JSON.parse(
        localStorage.getItem("cart") || "[]",
      ) as CreateOrderItemType[];
      setCart(updatedCart);
    } catch {
      setCart([]);
    }
  };

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
          <div className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-violet-300 uppercase">
            <LockOutlined aria-hidden />
            <span>{t("secureCheckout")}</span>
          </div>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {t("proceedToCheckout")}
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

          <ol
            className="mt-7 grid max-w-3xl grid-cols-3 gap-2"
            aria-label={t("secureCheckout")}
          >
            {[t("cartItems"), t("deliveryAddress"), t("securePayment")].map(
              (label, index) => (
                <li key={label} className="min-w-0">
                  <div className="h-1 rounded-full bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400" />
                  <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-200 sm:text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-violet-300 text-[10px] text-violet-200">
                      {index + 1}
                    </span>
                    <span className="truncate">{label}</span>
                  </div>
                </li>
              ),
            )}
          </ol>
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
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
            <section
              aria-labelledby="checkout-items-heading"
              className="min-w-0"
            >
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 bg-clip-text text-xs font-bold tracking-[0.16em] text-transparent uppercase">
                    {t("yourSelection")}
                  </p>
                  <h2
                    id="checkout-items-heading"
                    className="mt-1 text-2xl font-bold tracking-tight text-slate-950"
                  >
                    {t("orderItems")}
                  </h2>
                </div>
                <Link
                  href="/cart"
                  className="rounded-lg px-2 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none"
                >
                  {t("shoppingCart")}
                </Link>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {cart.map((item) => (
                  <CheckoutPageProduct
                    key={`${item.productId}:${item.variantId || ""}`}
                    productId={item.productId}
                    lang={locale}
                    quantity={item.quantity}
                    variantId={item.variantId}
                    onCartUpdate={handleCartUpdate}
                    setProductPrices={setProductPrices}
                  />
                ))}
              </div>
            </section>

            <CheckoutOrderSummary
              productPrices={productPrices}
              cart={cart}
              lang={locale}
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default Page;
