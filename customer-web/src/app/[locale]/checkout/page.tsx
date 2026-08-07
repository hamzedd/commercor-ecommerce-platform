"use client";

import { use, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import CheckoutPageProduct from "@/src/components/pageComponents/checkout/CheckoutPageProduct";
import CheckoutOrderSummary from "@/src/components/pageComponents/checkout/CheckoutOrderSummary";
import { CreateOrderItemType } from "@/src/utils/types/order.type";
import { ProductType } from "@/src/utils/types/product.type";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

function Page({ params }: Props) {
  const t = useTranslations();
  const { locale } = use(params);

  const [cart, setCart] = useState<CreateOrderItemType[]>([]);
  const [productPrices, setProductPrices] = useState<{
    [key: ProductType["id"]]: ProductType["price"];
  }>({});

  useEffect(() => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("cart") || "[]",
      ) as CreateOrderItemType[];

      setCart(savedCart);
    } catch {
      setCart([]);
    }
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

  return (
    <main className="my-10 flex flex-col items-center gap-5">
      <div className="my-container flex flex-col gap-5 self-center py-5 lg:flex-row">
        <div className="flex grow flex-col gap-5">
          {cart.length === 0 ? (
            <div className="rounded-lg border bg-white p-8 text-center">
              <p className="text-gray-500">{t("yourCartIsEmpty")}</p>
            </div>
          ) : (
            cart.map((item) => (
              <CheckoutPageProduct
                key={item.productId}
                productId={item.productId}
                lang={locale}
                quantity={item.quantity}
                onCartUpdate={handleCartUpdate}
                setProductPrices={setProductPrices}
              />
            ))
          )}
        </div>

        <div className="w-full lg:w-[300px]">
          <CheckoutOrderSummary
            productPrices={productPrices}
            cart={cart}
            lang={locale}
          />
        </div>
      </div>
    </main>
  );
}

export default Page;
