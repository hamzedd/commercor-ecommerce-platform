"use client";
import Image from "next/image";
import { Button } from "antd";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/src/i18n/navigation";
import {
  useWishlist,
  useWishlistActions,
} from "@/src/service/react-query/wishlist/useWishlist";
import { getCart, notifyCartUpdated } from "@/src/utils/cart/cartStorage";
import getImageSrcByBucketAndFileNames from "@/src/utils/functions/getImageSrcByBucketAndFileNames";
import formatCurrency from "@/src/utils/functions/formatCurrency";
import { useStoreSettings } from "@/src/components/providers/StoreSettingsProvider";
export default function ProfilePageWishlistTab() {
  const t = useTranslations(),
    { locale } = useParams<{ locale: string }>(),
    settings = useStoreSettings(),
    router = useRouter(),
    { data = [] } = useWishlist(),
    { remove } = useWishlistActions();
  if (!data.length)
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
        {t("wishlistEmpty")}
      </div>
    );
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {data.map((item) => {
        const p = item.product;
        if (!p)
          return (
            <article
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <p>{t("unavailable")}</p>
              <Button
                danger
                className="mt-3"
                onClick={() => remove.mutate(item.id)}
              >
                {t("removeFromWishlist")}
              </Button>
            </article>
          );
        const translation =
            p.translations.find(
              (x) => x.lang.toLowerCase() === locale.toLowerCase(),
            ) || p.translations[0],
          image = p.images?.[0]?.name;
        const add = () => {
          if (item.requiresOptionSelection) {
            router.push({
              pathname: "/products/[slug]",
              params: { slug: translation.slug },
            });
            return;
          }
          if (!item.available) return;
          const cart = getCart(),
            index = cart.findIndex(
              (x) =>
                x.productId === p.id &&
                (x.variantId || null) === (item.variantId || null),
            );
          if (index >= 0) cart[index].quantity += 1;
          else
            cart.push({
              productId: p.id,
              variantId: item.variantId,
              quantity: 1,
            });
          localStorage.setItem("cart", JSON.stringify(cart));
          notifyCartUpdated();
        };
        return (
          <article
            key={item.id}
            className="group flex gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:border-transparent hover:shadow-lg hover:shadow-violet-950/10"
          >
            <Link
              href={{
                pathname: "/products/[slug]",
                params: { slug: translation.slug },
              }}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100"
            >
              {image && (
                <Image
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  src={getImageSrcByBucketAndFileNames({
                    bucketName: "products",
                    fileName: image,
                  })}
                  alt={translation.name}
                />
              )}
            </Link>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-950">{translation.name}</h3>
              {item.variantDescription && (
                <p className="text-sm text-violet-700">
                  {item.variantDescription}
                </p>
              )}
              {(p.reviewCount || 0) > 0 && (
                <p className="text-sm text-violet-700">
                  ★ {p.averageRating?.toFixed(1)} ({p.reviewCount})
                </p>
              )}
              <p className="font-semibold text-slate-950">
                {formatCurrency(
                  item.effectivePrice,
                  settings.currencyCode,
                  locale,
                )}
              </p>
              <p
                className={`text-sm ${item.available ? "text-emerald-700" : "text-red-700"}`}
              >
                {item.available
                  ? item.requiresOptionSelection
                    ? t("selectOptions")
                    : t("inStock")
                  : t("unavailable")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="primary" disabled={!item.available} onClick={add}>
                  {item.requiresOptionSelection
                    ? t("selectOptions")
                    : t("addToCart")}
                </Button>
                <Button danger onClick={() => remove.mutate(item.id)}>
                  {t("remove")}
                </Button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
