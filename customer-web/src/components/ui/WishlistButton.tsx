"use client";

import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useCurrentUserQuery } from "@/src/service/react-query/user/query/useCurrentUserQuery";
import { useModalStore } from "@/src/components/providers/modalStoreProvider";
import {
  useWishlistActions,
  useWishlistStatus,
} from "@/src/service/react-query/wishlist/useWishlist";

export default function WishlistButton({
  productId,
  className = "",
}: {
  productId: string;
  className?: string;
}) {
  const t = useTranslations();
  const { data: user } = useCurrentUserQuery();
  const toggleLogin = useModalStore((state) => state.toggleLogin);
  const { data } = useWishlistStatus(Boolean(user));
  const { add, remove } = useWishlistActions();
  const item = data?.items.find(
    (entry) => entry.productId === productId && entry.variantId === null,
  );
  const active = Boolean(item);
  const pending = add.isPending || remove.isPending;

  return (
    <button
      type="button"
      aria-label={t(active ? "removeFromWishlist" : "addToWishlist")}
      aria-pressed={active}
      title={t(active ? "removeFromWishlist" : "addToWishlist")}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!user) return toggleLogin();
        if (active) remove.mutate(item!.id);
        else add.mutate({ productId });
      }}
      disabled={pending}
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-lg shadow-sm backdrop-blur transition duration-200 hover:scale-105 hover:shadow-md disabled:opacity-50 ${active ? "store-pop text-red-600" : "text-slate-700"} ${className}`}
    >
      {active ? <HeartFilled /> : <HeartOutlined />}
    </button>
  );
}
