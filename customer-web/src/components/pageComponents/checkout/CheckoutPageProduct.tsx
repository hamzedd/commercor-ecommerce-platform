"use client";

import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useEffect } from "react";

import { Link } from "@/src/i18n/navigation";
import { useProductQuery } from "@/src/service/react-query/product/query/useProductQuery";
import { notifyCartUpdated } from "@/src/utils/cart/cartStorage";
import getImageSrcByBucketAndFileNames from "@/src/utils/functions/getImageSrcByBucketAndFileNames";
import { CreateOrderItemType } from "@/src/utils/types/order.type";
import { ProductType } from "@/src/utils/types/product.type";
import { useStoreSettings } from "@/src/components/providers/StoreSettingsProvider";
import formatCurrency from "@/src/utils/functions/formatCurrency";

interface Props {
  productId: ProductType["id"];
  quantity: number;
  variantId?: string | null;
  lang: string;
  onCartUpdate?: () => void;
  setProductPrices: Dispatch<
    SetStateAction<Record<string, string | undefined>>
  >;
}

function CheckoutPageProduct({
  productId,
  quantity = 1,
  variantId,
  lang = "en",
  onCartUpdate,
  setProductPrices,
}: Props) {
  const t = useTranslations();
  const settings = useStoreSettings();
  const { data, isLoading, error } = useProductQuery({ id: productId });

  const updateCart = (updatedCart: CreateOrderItemType[]) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    notifyCartUpdated();
    if (onCartUpdate) onCartUpdate();
  };

  useEffect(() => {
    const variant = data?.variants?.find((v) => v.id === variantId);
    const price = variant?.effectivePrice ?? data?.price;
    if (price) {
      setProductPrices((previous) => ({
        ...previous,
        [`${data!.id}:${variantId || ""}`]: String(price),
      }));
    }
  }, [data, variantId, setProductPrices]);

  const handleQuantityChange = (newQuantity: number) => {
    const cart: CreateOrderItemType[] = JSON.parse(
      localStorage.getItem("cart") || "[]",
    );
    const itemIndex = cart.findIndex(
      (item) =>
        item.productId === productId &&
        (item.variantId || null) === (variantId || null),
    );
    if (itemIndex >= 0) {
      if (newQuantity <= 0) cart.splice(itemIndex, 1);
      else cart[itemIndex].quantity = newQuantity;
      updateCart(cart);
    }
  };

  const handleRemove = () => {
    const cart: CreateOrderItemType[] = JSON.parse(
      localStorage.getItem("cart") || "[]",
    );
    updateCart(
      cart.filter(
        (item) =>
          !(
            item.productId === productId &&
            (item.variantId || null) === (variantId || null)
          ),
      ),
    );
  };

  if (isLoading) {
    return (
      <div
        aria-busy="true"
        className="flex animate-pulse gap-4 rounded-2xl border border-slate-200 bg-white p-4 motion-reduce:animate-none"
      >
        <div className="h-24 w-24 shrink-0 rounded-xl bg-slate-200 sm:h-32 sm:w-32" />
        <div className="flex-1 space-y-3 py-1">
          <div className="h-5 w-3/4 rounded bg-slate-200" />
          <div className="h-4 w-1/2 rounded bg-slate-100" />
          <div className="h-10 w-36 rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
      >
        {t("failedToLoadProduct")}
      </div>
    );
  }

  const translation =
    data.translations.find(
      (item) => item.lang.toLowerCase() === lang.toLowerCase(),
    ) || data.translations[0];
  const variant = data.variants?.find((v) => v.id === variantId);
  const primaryImageName = variant?.image || data.images?.[0]?.name;
  const price = Number(variant?.effectivePrice ?? data.price ?? 0);
  const totalPrice = price * quantity;

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:border-transparent hover:shadow-lg hover:shadow-violet-950/10 sm:p-4">
      <div className="flex min-w-0 gap-3 sm:gap-4">
        <Link
          href={{
            pathname: "/products/[slug]",
            params: { slug: translation.slug },
          }}
          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:outline-none sm:h-32 sm:w-32"
        >
          {primaryImageName ? (
            <Image
              src={getImageSrcByBucketAndFileNames({
                bucketName: "products",
                fileName: primaryImageName,
              })}
              alt={translation?.name || t("product")}
              fill
              sizes="(max-width: 640px) 96px, 128px"
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="flex h-full items-center justify-center px-2 text-center text-xs text-slate-500">
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
                className="line-clamp-2 text-sm leading-5 font-bold text-slate-950 transition-colors hover:text-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none sm:text-base"
              >
                {translation?.name}
              </Link>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {formatCurrency(price, settings.currencyCode, lang)} {t("each")}
              </p>
              {variant && (
                <p className="mt-1 text-xs font-medium text-violet-700">
                  {variant.description}
                </p>
              )}
              {data.stock !== undefined && (
                <p className="mt-1 text-xs text-slate-500">
                  {data.stock} {t("inStock")}
                </p>
              )}
            </div>
            <p className="shrink-0 text-base font-bold text-slate-950 sm:text-lg">
              {formatCurrency(totalPrice, settings.currencyCode, lang)}
            </p>
          </div>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-3">
            <div>
              <span className="mb-1 block text-xs font-medium text-slate-500">
                {t("quantity")}
              </span>
              <div className="flex w-fit items-center overflow-hidden rounded-xl border border-slate-300">
                <button
                  type="button"
                  aria-label={t("decreaseQuantity")}
                  disabled={quantity <= 1}
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-violet-50 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <MinusOutlined aria-hidden />
                </button>
                <output className="flex h-11 min-w-10 items-center justify-center border-x border-slate-300 px-2 text-sm font-bold">
                  {quantity}
                </output>
                <button
                  type="button"
                  aria-label={t("increaseQuantity")}
                  disabled={quantity >= (variant?.stock ?? data.stock ?? 0)}
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-violet-50 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-40"
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

export default CheckoutPageProduct;
