"use client";

import {
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useModalStore } from "@/src/components/providers/modalStoreProvider";
import { useRouter } from "@/src/i18n/navigation";
import { useCurrentUserQuery } from "@/src/service/react-query/user/query/useCurrentUserQuery";
import { addCartItem } from "@/src/utils/cart/cartStorage";
import { ProductType } from "@/src/utils/types/product.type";
import { useStoreSettings } from "@/src/components/providers/StoreSettingsProvider";
import formatCurrency from "@/src/utils/functions/formatCurrency";
import WishlistButton from "@/src/components/ui/WishlistButton";

interface Props {
  product: ProductType;
}

function ProductPurchaseBox({ product }: Props) {
  const t = useTranslations();
  const settings = useStoreSettings();
  const { data: user } = useCurrentUserQuery();
  const router = useRouter();
  const toggleLogin = useModalStore((state) => state.toggleLogin);
  const [quantity, setQuantity] = useState(1);
  const [selected,setSelected]=useState<Record<string,string>>({});
  const variants=product.variants||[]; const optionGroups=Array.from(new Map(variants.flatMap(v=>v.options).map(o=>[o.optionId,{name:o.optionName,values:new Map<string,string>()}])).values());
  for(const v of variants)for(const o of v.options){const group=optionGroups.find(g=>g.name===o.optionName);group?.values.set(o.valueId,o.value)}
  const selectedVariant=variants.find(v=>v.options.every(o=>selected[o.optionId]===o.valueId)); const effectiveStock=selectedVariant?.stock??(variants.length?0:product.stock||0); const effectivePrice=selectedVariant?.effectivePrice??(product.price||0);

  const handleAddInCard = async () => {
    if (!user) {
      toggleLogin();
      return;
    }
    if(variants.length&&!selectedVariant)return;
    await addCartItem({ productId: product.id, variantId:selectedVariant?.id||null, quantity });
  };

  const handlePurchase = async () => {
    await handleAddInCard();
    if (user) router.push("/checkout");
  };

  const increaseQuantity = () => setQuantity((previous) => previous + 1);
  const decreaseQuantity = () =>
    setQuantity((previous) => (previous > 1 ? previous - 1 : 1));

  return (
    <aside className="w-full rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-28">
      <div className="mb-3 flex justify-end"><WishlistButton productId={product.id}/></div>
      <div className="border-b border-stone-200 pb-5">
        <p className="text-xs font-bold tracking-[0.16em] text-amber-700 uppercase">
          {t("price")}
        </p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
          {formatCurrency(effectivePrice, settings.currencyCode)}
        </p>
        {(product.stock !== undefined||variants.length>0) && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span
              aria-hidden
              className={`h-2.5 w-2.5 rounded-full ${effectiveStock > 0 ? "bg-emerald-500" : "bg-red-500"}`}
            />
            <span
              className={`font-semibold ${effectiveStock > 0 ? "text-emerald-700" : "text-red-700"}`}
            >
              {effectiveStock > 0 ? `${effectiveStock} ${t("inStock")}` : variants.length&&!selectedVariant?t("selectVariant"):t("outOfStock")}
            </span>
          </div>
        )}
      </div>

      {variants.length>0&&<div className="space-y-4 border-b border-stone-200 py-5">{optionGroups.map(group=><div key={group.name}><p className="mb-2 text-sm font-semibold">{group.name}</p><div className="flex flex-wrap gap-2">{Array.from(group.values).map(([valueId,label])=>{const possible=variants.some(v=>v.stock>0&&v.enabled&&v.options.some(o=>o.valueId===valueId)&&v.options.every(o=>o.optionName===group.name||!selected[o.optionId]||selected[o.optionId]===o.valueId));return <button type="button" key={valueId} disabled={!possible} onClick={()=>{const optionId=variants.flatMap(v=>v.options).find(o=>o.valueId===valueId)!.optionId;setSelected(s=>({...s,[optionId]:valueId}));setQuantity(1)}} className={`rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-30 ${Object.values(selected).includes(valueId)?'border-amber-600 bg-amber-50':'border-stone-300'}`}>{label}</button>})}</div></div>)}</div>}

      <div className="py-5">
        <p className="mb-2 text-sm font-semibold text-stone-800">
          {t("quantity")}
        </p>
        <div className="flex w-fit items-center overflow-hidden rounded-xl border border-stone-300 bg-white">
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            aria-label={t("decreaseQuantity")}
            className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-40"
          >
            <MinusOutlined aria-hidden />
          </button>
          <output
            aria-live="polite"
            className="flex h-11 min-w-12 items-center justify-center border-x border-stone-300 px-3 font-bold text-stone-950"
          >
            {quantity}
          </output>
          <button
            type="button"
          onClick={increaseQuantity}
            disabled={quantity>=effectiveStock}
            aria-label={t("increaseQuantity")}
            className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none focus-visible:ring-inset"
          >
            <PlusOutlined aria-hidden />
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        <button
          type="button"
          onClick={handleAddInCard}
          disabled={(variants.length>0&&!selectedVariant)||effectiveStock<quantity}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-stone-950 bg-white px-5 text-sm font-bold text-stone-950 transition-colors duration-200 hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <ShoppingCartOutlined aria-hidden className="text-lg" />
          {t("addToCart")}
        </button>
        <button
          type="button"
          onClick={handlePurchase}
          disabled={(variants.length>0&&!selectedVariant)||effectiveStock<quantity}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-stone-950 px-5 text-sm font-bold text-white transition-colors duration-200 hover:bg-amber-600 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <ThunderboltOutlined aria-hidden className="text-lg" />
          {t("buyNow")}
        </button>
      </div>

      <div className="mt-6 border-t border-stone-200 pt-5">
        <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-3 text-sm text-stone-700">
          <svg
            aria-hidden
            className="h-5 w-5 shrink-0 text-amber-700"
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
