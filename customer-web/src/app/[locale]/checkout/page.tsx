"use client";

import { CreateOrderItemType } from "@/src/utils/types/order.type";
import CheckoutPageProduct from "@/src/components/pageComponents/checkout/CheckoutPageProduct";
import CheckoutOrderSummary from "@/src/components/pageComponents/checkout/CheckoutOrderSummary";
import { useState, useEffect } from "react";
import { ProductType } from "@/src/utils/types/product.type";
import { useTranslations } from "next-intl";

interface Props {
  params: {
    locale: string;
  };
}

function Page(props: Props) {
  const t = useTranslations();
  const { locale } = props.params;

  const [cart, setCart] = useState<CreateOrderItemType[]>(
    JSON.parse(localStorage.getItem("cart") || "[]"),
  );
  const [productPrices, setProductPrices] = useState<{
    [key: ProductType["id"]]: ProductType["price"];
  }>({});

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCart(savedCart);
  }, []);

  // Update cart state when cart changes
  const handleCartUpdate = () => {
    const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(updatedCart);
  };

  return (
    <main className={"my-10 flex flex-col items-center gap-5"}>
      <div
        className={
          "my-container flex flex-col gap-5 self-center py-5 lg:flex-row"
        }
      >
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
                lang={props.params.locale}
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
