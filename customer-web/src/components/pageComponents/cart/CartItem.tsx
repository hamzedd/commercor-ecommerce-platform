"use client";

import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useEffect } from "react";

import { Link } from "@/src/i18n/navigation";
import { useProductQuery } from "@/src/service/react-query/product/query/useProductQuery";
import getImageSrcByBucketAndFileNames from "@/src/utils/functions/getImageSrcByBucketAndFileNames";
import { notifyCartUpdated } from "@/src/utils/cart/cartStorage";
import { CreateOrderItemType } from "@/src/utils/types/order.type";
import { ProductType } from "@/src/utils/types/product.type";

interface Props {
  productId: ProductType["id"];
  quantity: number;
  lang: string;
  onCartUpdate: () => void;
  setProductPrices: Dispatch<
    SetStateAction<Record<string, string | undefined>>
  >;
}

function CartItem({
  productId,
  quantity,
  lang,
  onCartUpdate,
  setProductPrices,
}: Props) {
  const t = useTranslations();
  const { data, isLoading, error } = useProductQuery({ id: productId });

  useEffect(() => {
    if (data?.price)
      setProductPrices((previous) => ({ ...previous, [data.id]: data.price }));
  }, [data?.id, data?.price, setProductPrices]);

  const updateCart = (updatedCart: CreateOrderItemType[]) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    notifyCartUpdated();
    onCartUpdate();
  };

  const handleQuantityChange = (newQuantity: number) => {
    const cart: CreateOrderItemType[] = JSON.parse(
      localStorage.getItem("cart") || "[]",
    );
    const itemIndex = cart.findIndex((item) => item.productId === productId);
    if (itemIndex < 0) return;
    if (newQuantity <= 0) cart.splice(itemIndex, 1);
    else cart[itemIndex].quantity = newQuantity;
    updateCart(cart);
  };

  const handleRemove = () => {
    const cart: CreateOrderItemType[] = JSON.parse(
      localStorage.getItem("cart") || "[]",
    );
    updateCart(cart.filter((item) => item.productId !== productId));
  };

  if (isLoading) {
    return (
      <div
        aria-busy="true"
        className="flex animate-pulse gap-4 rounded-2xl border border-stone-200 bg-white p-4 motion-reduce:animate-none"
      >
        <div className="h-24 w-24 shrink-0 rounded-xl bg-stone-200" />
        <div className="flex-1 space-y-3 py-1">
          <div className="h-5 w-3/4 rounded bg-stone-200" />
          <div className="h-4 w-1/2 rounded bg-stone-100" />
          <div className="h-8 w-32 rounded bg-stone-200" />
        </div>
      </div>
    );
  }

  if (error || !data)
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
        {t("failedToLoadProduct")}
      </div>
    );

  const translation =
    data.translations.find(
      (item) => item.lang.toLowerCase() === lang.toLowerCase(),
    ) || data.translations[0];
  const primaryImage = data.images?.[0];
  const unitPrice = Number.parseFloat(data.price || "0");
  const totalPrice = unitPrice * quantity;

  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex min-w-0 gap-3 sm:gap-4">
        <Link
          href={{
            pathname: "/products/[slug]",
            params: { slug: translation.slug },
          }}
          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none sm:h-32 sm:w-32"
        >
          {primaryImage ? (
            <Image
              src={getImageSrcByBucketAndFileNames({
                bucketName: "products",
                fileName: primaryImage.name,
              })}
              alt={translation?.name || t("product")}
              fill
              sizes="(max-width: 640px) 96px, 128px"
              className="object-contain p-2"
            />
          ) : (
            <span className="flex h-full items-center justify-center px-2 text-center text-xs text-stone-500">
              {t("noImage")}
            </span>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                href={{
                  pathname: "/products/[slug]",
                  params: { slug: translation.slug },
                }}
                className="line-clamp-2 text-sm leading-5 font-bold text-stone-950 hover:text-amber-700 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none sm:text-base"
              >
                {translation?.name}
              </Link>
              <p className="mt-1 text-xs text-stone-500 sm:text-sm">
                ${unitPrice.toFixed(2)} {t("each")}
              </p>
            </div>
            <p className="shrink-0 text-base font-bold text-stone-950 sm:text-lg">
              ${totalPrice.toFixed(2)}
            </p>
          </div>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-3">
            <div>
              <span className="mb-1 block text-xs font-medium text-stone-500">
                {t("quantity")}
              </span>
              <div className="flex w-fit items-center overflow-hidden rounded-xl border border-stone-300">
                <button
                  type="button"
                  aria-label={t("decreaseQuantity")}
                  disabled={quantity <= 1}
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <MinusOutlined aria-hidden />
                </button>
                <output className="flex h-11 min-w-10 items-center justify-center border-x border-stone-300 px-2 text-sm font-bold">
                  {quantity}
                </output>
                <button
                  type="button"
                  aria-label={t("increaseQuantity")}
                  disabled={data.stock !== undefined && quantity >= data.stock}
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <PlusOutlined aria-hidden />
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:outline-none"
            >
              <DeleteOutlined aria-hidden />
              {t("remove")}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CartItem;
