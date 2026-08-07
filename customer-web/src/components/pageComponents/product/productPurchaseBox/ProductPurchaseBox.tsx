"use client";
import { ProductType } from "@/src/utils/types/product.type";
import { CreateOrderItemType } from "@/src/utils/types/order.type";
import { useRouter } from "@/src/i18n/navigation";
import { useModalStore } from "@/src/components/providers/modalStoreProvider";
import { useCurrentUserQuery } from "@/src/service/react-query/user/query/useCurrentUserQuery";
import { ShoppingCartOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { notifyCartUpdated } from "@/src/utils/cart/cartStorage";

interface Props {
  product: ProductType;
}

function ProductPurchaseBox({ product }: Props) {
  const t = useTranslations();
  const { data: user } = useCurrentUserQuery();
  const router = useRouter();
  const toggleLogin = useModalStore((state) => state.toggleLogin);
  const [quantity, setQuantity] = useState(1);

  const handleAddInCard = () => {
    if (!user) {
      toggleLogin();
      return;
    }
    const cart: CreateOrderItemType[] = JSON.parse(
      localStorage.getItem("cart") || "[]",
    );

    const indexOfProduct = cart.findIndex(
      (value) => value.productId === product.id,
    );

    if (indexOfProduct >= 0) {
      cart[indexOfProduct].quantity = cart[indexOfProduct].quantity + quantity;
    } else {
      cart.push({
        productId: product.id,
        quantity: quantity,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    notifyCartUpdated();
  };

  const handlePurchase = () => {
    handleAddInCard();
    if (user) {
      router.push("/checkout");
    }
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div
      className={
        "w-full rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24 lg:w-[360px]"
      }
    >
      <h2 className={"mb-6 text-2xl font-bold text-gray-900"}>
        {t("purchase")}
      </h2>

      {/* Price Display */}
      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <p className="mb-1 text-sm text-gray-600">{t("price")}</p>
        <p className="text-3xl font-bold text-gray-900">${product.price}</p>
      </div>

      {/* Quantity Selector */}
      <div className="mb-6">
        <p className="mb-2 text-sm font-medium text-gray-700">
          {t("quantity")}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={decreaseQuantity}
            className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-gray-300 font-bold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
          >
            −
          </button>
          <span className="flex h-10 w-16 items-center justify-center rounded-lg border-2 border-gray-300 font-semibold">
            {quantity}
          </span>
          <button
            onClick={increaseQuantity}
            className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-gray-300 font-bold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Stock Status */}
      {product.stock !== undefined && (
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{t("availability")}:</span>{" "}
            {product.stock > 0 ? (
              <span className="font-semibold text-green-600">
                {product.stock} {t("inStock")}
              </span>
            ) : (
              <span className="font-semibold text-red-600">
                {t("outOfStock")}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <button
          type={"button"}
          className={
            "flex items-center justify-center gap-2 rounded-lg border-2 border-black bg-white px-6 py-3 font-semibold text-black transition-all hover:bg-gray-50"
          }
          onClick={handleAddInCard}
        >
          <ShoppingCartOutlined className="text-lg" />
          <span>{t("addToCart")}</span>
        </button>
        <button
          onClick={handlePurchase}
          type={"button"}
          className={
            "flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-3 font-semibold text-white transition-all hover:bg-gray-800"
          }
        >
          <ThunderboltOutlined className="text-lg" />
          <span>{t("buyNow")}</span>
        </button>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 space-y-2 border-t pt-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg
            className="h-5 w-5 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{t("securePayment")}</span>
        </div>
      </div>
    </div>
  );
}

export default ProductPurchaseBox;
