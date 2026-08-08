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
    <main className="min-h-screen bg-stone-50 pb-16 text-stone-950">
      <section className="border-b border-white/10 bg-stone-950 text-white">
        <div className="my-container py-8 sm:py-10 lg:py-12">
          <div className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-amber-300 uppercase">
            <LockOutlined aria-hidden />
            <span>{t("secureCheckout")}</span>
          </div>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {t("proceedToCheckout")}
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

          <ol
            className="mt-7 grid max-w-3xl grid-cols-3 gap-2"
            aria-label={t("secureCheckout")}
          >
            {[t("cartItems"), t("deliveryAddress"), t("securePayment")].map(
              (label, index) => (
                <li key={label} className="min-w-0">
                  <div className="h-1 rounded-full bg-amber-400" />
                  <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-stone-200 sm:text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-300 text-[10px] text-amber-200">
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
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-stone-950 px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-amber-600 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none"
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
                  <p className="text-xs font-bold tracking-[0.16em] text-amber-700 uppercase">
                    {t("yourSelection")}
                  </p>
                  <h2
                    id="checkout-items-heading"
                    className="mt-1 text-2xl font-bold tracking-tight"
                  >
                    {t("orderItems")}
                  </h2>
                </div>
                <Link
                  href="/cart"
                  className="rounded-lg px-2 py-2 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-100 hover:text-amber-700 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                >
                  {t("shoppingCart")}
                </Link>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {cart.map((item) => (
                  <CheckoutPageProduct
                    key={item.productId}
                    productId={item.productId}
                    lang={locale}
                    quantity={item.quantity}
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
