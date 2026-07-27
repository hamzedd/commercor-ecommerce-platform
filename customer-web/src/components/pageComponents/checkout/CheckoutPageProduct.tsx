"use client";

import { ProductType } from "@/src/utils/types/product.type";
import { useProductQuery } from "@/src/service/react-query/product/query/useProductQuery";
import Image from "next/image";
import getImageSrcByBucketAndFileNames from "@/src/utils/functions/getImageSrcByBucketAndFileNames";
import { CreateOrderItemType } from "@/src/utils/types/order.type";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useTranslations } from "next-intl";

interface Props {
  productId: ProductType["id"];
  quantity: number;
  lang: string;
  onCartUpdate?: () => void;
  setProductPrices: Dispatch<
    SetStateAction<{ [p: string]: string | undefined }>
  >;
}

function CheckoutPageProduct({
  productId,
  quantity = 1,
  lang = "en",
  onCartUpdate,
  setProductPrices,
}: Props) {
  const t = useTranslations();
  const { data, isLoading, error } = useProductQuery({ id: productId });

  const updateCart = (updatedCart: CreateOrderItemType[]) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    if (onCartUpdate) {
      onCartUpdate();
    }
  };

  useEffect(() => {
    if (data?.price) {
      setProductPrices((prev) => ({
        ...prev,
        [data.id]: data.price,
      }));
    }
  }, [data?.id]);

  const handleQuantityChange = (newQuantity: number) => {
    const cart: CreateOrderItemType[] = JSON.parse(
      localStorage.getItem("cart") || "[]",
    );

    const itemIndex = cart.findIndex((item) => item.productId === productId);

    if (itemIndex >= 0) {
      if (newQuantity <= 0) {
        // Remove item if quantity is 0 or less
        cart.splice(itemIndex, 1);
      } else {
        // Update quantity
        cart[itemIndex].quantity = newQuantity;
      }
      updateCart(cart);
    }
  };

  const handleRemove = () => {
    const cart: CreateOrderItemType[] = JSON.parse(
      localStorage.getItem("cart") || "[]",
    );

    const updatedCart = cart.filter((item) => item.productId !== productId);
    updateCart(updatedCart);
  };

  const handleIncrement = () => {
    handleQuantityChange(quantity + 1);
  };

  const handleDecrement = () => {
    handleQuantityChange(quantity - 1);
  };

  if (isLoading) {
    return (
      <div className="flex animate-pulse items-center gap-4 rounded-lg border p-4">
        <div className="h-20 w-20 rounded bg-gray-200"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="h-3 w-1/2 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-600">{t("failedToLoadProduct")}</p>
      </div>
    );
  }

  // Get the translation for the current language or fallback to first available
  const translation =
    data.translations.find(
      (t) => t.lang.toLowerCase() === lang.toLowerCase(),
    ) || data.translations[0];

  const primaryImage = data.images?.[0];
  const price = parseFloat(data.price || "0");
  const totalPrice = price * quantity;

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-white p-4 sm:flex-row sm:items-center">
      <div className="flex gap-4">
        {/* Product Image */}
        {primaryImage ? (
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-100">
            <Image
              src={getImageSrcByBucketAndFileNames({
                bucketName: "products",
                fileName: primaryImage.name,
              })}
              alt={translation?.name || t("product")}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded bg-gray-200">
            <span className="text-xs text-gray-400">{t("noImage")}</span>
          </div>
        )}

        {/* Product Info - Mobile */}
        <div className="flex min-w-0 flex-1 flex-col justify-between sm:hidden">
          <div>
            <h3 className="truncate font-medium text-gray-900">
              {translation?.name}
            </h3>
            {translation?.description && (
              <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                {translation.description}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-900">
              ${totalPrice?.toFixed(2)}
            </p>
            {quantity > 1 && (
              <p className="text-sm text-gray-500">
                ${price?.toFixed(2)} {t("each")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Product Details - Desktop */}
      <div className="hidden min-w-0 flex-1 sm:block">
        <h3 className="truncate font-medium text-gray-900">
          {translation?.name}
        </h3>
        {translation?.description && (
          <p className="mt-1 line-clamp-1 text-sm text-gray-500">
            {translation.description}
          </p>
        )}
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-gray-300">
          <button
            onClick={handleDecrement}
            className="flex h-8 w-8 items-center justify-center rounded-l-lg hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={quantity <= 1}
            type="button"
          >
            <MinusOutlined className="h-4 w-4" />
          </button>
          <span className="min-w-[2rem] text-center text-sm font-medium">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            className="flex h-8 w-8 items-center justify-center rounded-r-lg hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={data.stock !== undefined && quantity >= data.stock}
            type="button"
          >
            <PlusOutlined className="h-4 w-4" />
          </button>
        </div>

        {data.stock !== undefined && (
          <span className="text-xs text-gray-400">
            ({data.stock} {t("inStock")})
          </span>
        )}

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="flex items-center gap-1 rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50 sm:ml-auto"
          type="button"
        >
          <DeleteOutlined className="h-4 w-4" />
          <span>{t("remove")}</span>
        </button>
      </div>

      {/* Price - Desktop */}
      <div className="hidden flex-shrink-0 text-right sm:block">
        <p className="font-semibold text-gray-900">${totalPrice?.toFixed(2)}</p>
        {quantity > 1 && (
          <p className="text-sm text-gray-500">
            ${price?.toFixed(2)} {t("each")}
          </p>
        )}
      </div>
    </div>
  );
}

export default CheckoutPageProduct;
