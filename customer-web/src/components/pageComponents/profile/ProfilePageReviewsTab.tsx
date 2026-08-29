"use client";
import { useEffect, useState } from "react";
import { Button, Rate } from "antd";
import { useTranslations } from "next-intl";
import {
  deleteReview,
  getMyReviews,
} from "@/src/service/apiServices/review.service";
import type { ProductReview } from "@/src/utils/types/product.type";
export default function ProfilePageReviewsTab() {
  const t = useTranslations(),
    [rows, setRows] = useState<ProductReview[]>([]);
  const load = () =>
    getMyReviews()
      .then(setRows)
      .catch(() => {});
  useEffect(() => {
    void load();
  }, []);
  return (
    <div className="space-y-3">
      {rows.length ? (
        rows.map((r) => {
          const name = r.product?.translations?.[0]?.name || t("product");
          return (
            <article key={r.id} className="rounded-xl border bg-white p-4">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <b>{name}</b>
                  <div>
                    <Rate disabled value={r.rating} />
                  </div>
                  <p className="text-sm text-slate-600">{r.title}</p>
                  <p className="mt-1 text-sm">{r.comment}</p>
                  <p className="mt-2 text-xs font-bold text-violet-700 uppercase">
                    {r.status}
                  </p>
                </div>
                <Button
                  danger
                  onClick={() => deleteReview(r.productId!, r.id).then(load)}
                >
                  {t("deleteReview")}
                </Button>
              </div>
            </article>
          );
        })
      ) : (
        <p>{t("noReviewsYet")}</p>
      )}
    </div>
  );
}
