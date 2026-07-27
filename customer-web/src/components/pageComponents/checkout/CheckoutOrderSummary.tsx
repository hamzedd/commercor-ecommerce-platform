"use client";

import { CreateOrderItemType } from "@/src/utils/types/order.type";
import { createOrderService } from "@/src/service/apiServices/order.service";
import CheckoutAddressList from "@/src/components/pageComponents/checkout/CheckoutAddressList";
import { useState } from "react";
import { AddressType } from "@/src/utils/types/address.type";
import { useRouter } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";

interface Props {
  cart: CreateOrderItemType[];
  lang: string;
  productPrices: { [p: string]: string | undefined };
}

function CheckoutOrderSummary({ cart, productPrices }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<AddressType["id"]>("");

  const handleCheckout = async () => {
    const { paymentUrl } = await createOrderService({
      items: cart,
      addressId: selectedAddress,
    });
    router.push(paymentUrl as any);
  };

  const calculateTotalPrice = () => {
    let total = 0;

    cart.forEach((item) => {
      const price = productPrices?.[item.productId];
      if (price) {
        total += +price * item.quantity;
      }
    });

    return total;
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className="sticky top-5 flex h-fit flex-col gap-4 rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold">{t("orderSummary")}</h2>

      {/* Total */}
      <div className="flex justify-between text-lg font-bold">
        <span>{t("total")}</span>
        {Number.isInteger(totalPrice) && <span>${calculateTotalPrice()}</span>}
      </div>
      <CheckoutAddressList
        onAddressSelect={setSelectedAddress}
        selectedAddressId={selectedAddress}
      />
      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={cart.length === 0 && !selectedAddress}
        className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {t("proceedToCheckout")}
      </button>

      {/* Additional Info */}
      <div className="mt-4 space-y-2 text-xs text-gray-500">
        <p className="flex items-center gap-2">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          {t("secureCheckout")}
        </p>
        <p className="flex items-center gap-2">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
          {t("freeReturns")}
        </p>
      </div>
    </div>
  );
}

export default CheckoutOrderSummary;
