"use client";

import {
  CheckOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useModalStore } from "@/src/components/providers/modalStoreProvider";
import { useRouter } from "@/src/i18n/navigation";
import { useCurrentUserQuery } from "@/src/service/react-query/user/query/useCurrentUserQuery";
import { addCartItem } from "@/src/utils/cart/cartStorage";
import { ProductType } from "@/src/utils/types/product.type";
import { useStoreSettings } from "@/src/components/providers/StoreSettingsProvider";
import formatCurrency from "@/src/utils/functions/formatCurrency";
import WishlistButton from "@/src/components/ui/WishlistButton";
import Reveal from "@/src/components/ui/utis/reveal/Reveal";

interface Props {
  product: ProductType;
}

function ProductPurchaseBox({ product }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const settings = useStoreSettings();
  const { data: user } = useCurrentUserQuery();
  const router = useRouter();
  const toggleLogin = useModalStore((state) => state.toggleLogin);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [addingToCart, setAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [buying, setBuying] = useState(false);
  const justAddedTimeout = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(justAddedTimeout.current), []);
  const variants = product.variants || [];
  const optionGroups = Array.from(
    new Map(
      variants
        .flatMap((v) => v.options)
        .map((o) => [
          o.optionId,
          { name: o.optionName, values: new Map<string, string>() },
        ]),
    ).values(),
  );
  for (const v of variants)
    for (const o of v.options) {
      const group = optionGroups.find((g) => g.name === o.optionName);
      group?.values.set(o.valueId, o.value);
    }
  const selectedVariant = variants.find((v) =>
    v.options.every((o) => selected[o.optionId] === o.valueId),
  );
  const effectiveStock =
    selectedVariant?.stock ?? (variants.length ? 0 : product.stock || 0);
  const effectivePrice =
    selectedVariant?.effectivePrice ?? (product.price || 0);

  const handleAddInCard = async () => {
    if (!user) {
      toggleLogin();
      return;
    }
    if (variants.length && !selectedVariant) return;
    try {
      await addCartItem({
        productId: product.id,
        variantId: selectedVariant?.id || null,
        quantity,
      });
      return true;
    } catch {
      // The API notification layer presents expected commerce errors.
      return false;
    }
  };

  const handleAddToCartClick = async () => {
    setAddingToCart(true);
    const added = await handleAddInCard();
    setAddingToCart(false);
    if (added) {
      setJustAdded(true);
      window.clearTimeout(justAddedTimeout.current);
      justAddedTimeout.current = window.setTimeout(
        () => setJustAdded(false),
        1800,
      );
    }
  };

  const handlePurchase = async () => {
    setBuying(true);
    const added = await handleAddInCard();
    if (user && added) {
      router.push("/checkout");
      return;
    }
    setBuying(false);
  };

  const increaseQuantity = () => setQuantity((previous) => previous + 1);
  const decreaseQuantity = () =>
    setQuantity((previous) => (previous > 1 ? previous - 1 : 1));

  return (
    <aside className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-3 flex justify-end">
        <WishlistButton productId={product.id} />
      </div>
      <Reveal className="border-b border-slate-200 pb-5">
        <p className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 bg-clip-text text-xs font-bold tracking-[0.16em] text-transparent uppercase">
          {t("price")}
        </p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          {formatCurrency(effectivePrice, settings.currencyCode, locale)}
        </p>
        {(product.stock !== undefined || variants.length > 0) && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span
              aria-hidden
              className={`h-2.5 w-2.5 rounded-full ${effectiveStock > 0 ? "animate-pulse bg-emerald-500" : "bg-red-500"} motion-reduce:animate-none`}
            />
            <span
              className={`font-semibold ${effectiveStock > 0 ? "text-emerald-700" : "text-red-700"}`}
            >
              {effectiveStock > 0
                ? `${effectiveStock} ${t("inStock")}`
                : variants.length && !selectedVariant
                  ? t("selectVariant")
                  : t("outOfStock")}
            </span>
          </div>
        )}
      </Reveal>

      {variants.length > 0 && (
        <div className="space-y-4 border-b border-slate-200 py-5">
          {optionGroups.map((group) => (
            <div key={group.name}>
              <p className="mb-2 text-sm font-semibold">{group.name}</p>
              <div className="flex flex-wrap gap-2">
                {Array.from(group.values).map(([valueId, label]) => {
                  const possible = variants.some(
                    (v) =>
                      v.stock > 0 &&
                      v.enabled &&
                      v.options.some((o) => o.valueId === valueId) &&
                      v.options.every(
                        (o) =>
                          o.optionName === group.name ||
                          !selected[o.optionId] ||
                          selected[o.optionId] === o.valueId,
                      ),
                  );
                  const isSelected = Object.values(selected).includes(valueId);
                  return (
                    <button
                      type="button"
                      key={valueId}
                      disabled={!possible}
                      onClick={() => {
                        const optionId = variants
                          .flatMap((v) => v.options)
                          .find((o) => o.valueId === valueId)!.optionId;
                        setSelected((s) => ({ ...s, [optionId]: valueId }));
                        setQuantity(1);
                      }}
                      className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-all duration-200 disabled:opacity-30 ${isSelected ? "border-violet-600 bg-violet-50 text-violet-900 shadow-sm shadow-violet-500/20" : "border-slate-300 hover:border-violet-300"}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="py-5">
        <p className="mb-2 text-sm font-semibold text-slate-800">
          {t("quantity")}
        </p>
        <div className="flex w-fit items-center overflow-hidden rounded-xl border border-slate-300 bg-white">
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            aria-label={t("decreaseQuantity")}
            className="btn-press flex h-11 w-11 items-center justify-center transition-colors hover:bg-violet-50 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-40"
          >
            <MinusOutlined aria-hidden />
          </button>
          <output
            key={quantity}
            aria-live="polite"
            className="store-pop flex h-11 min-w-12 items-center justify-center border-x border-slate-300 px-3 font-bold text-slate-950"
          >
            {quantity}
          </output>
          <button
            type="button"
            onClick={increaseQuantity}
            disabled={quantity >= effectiveStock}
            aria-label={t("increaseQuantity")}
            className="btn-press flex h-11 w-11 items-center justify-center transition-colors hover:bg-violet-50 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none focus-visible:ring-inset"
          >
            <PlusOutlined aria-hidden />
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        <button
          type="button"
          onClick={handleAddToCartClick}
          disabled={
            addingToCart ||
            (variants.length > 0 && !selectedVariant) ||
            effectiveStock < quantity
          }
          className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 px-5 text-sm font-bold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed ${
            justAdded
              ? "store-pop border-emerald-600 bg-emerald-50 text-emerald-700"
              : "border-slate-950 bg-white text-slate-950 hover:border-violet-600 hover:text-violet-700 disabled:opacity-60"
          }`}
        >
          {addingToCart ? (
            <span
              aria-hidden
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
          ) : justAdded ? (
            <CheckOutlined
              aria-hidden
              className="animate-success-check text-lg"
            />
          ) : (
            <ShoppingCartOutlined aria-hidden className="text-lg" />
          )}
          {t("addToCart")}
        </button>
        <button
          type="button"
          onClick={handlePurchase}
          disabled={
            buying ||
            (variants.length > 0 && !selectedVariant) ||
            effectiveStock < quantity
          }
          className="checkout-primary-cta btn-shimmer flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 px-5 text-sm font-bold shadow-md shadow-violet-900/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-800/30 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
        >
          {buying ? (
            <span
              aria-hidden
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
          ) : (
            <ThunderboltOutlined aria-hidden className="text-lg" />
          )}
          {t("buyNow")}
        </button>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-5">
        <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-50 to-blue-50 p-3 text-sm text-slate-700">
          <svg
            aria-hidden
            className="h-5 w-5 shrink-0 text-violet-700"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">{t("securePayment")}</span>
        </div>
      </div>
    </aside>
  );
}

export default ProductPurchaseBox;
