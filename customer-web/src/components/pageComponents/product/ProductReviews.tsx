"use client";

import { useEffect, useState } from "react";
import { Button, Input, Rate } from "antd";
import { useTranslations } from "next-intl";
import Reveal from "@/src/components/ui/utis/reveal/Reveal";
import {
  createReview,
  deleteReview,
  getReviewEligibility,
  getReviews,
  getReviewSummary,
  updateReview,
} from "@/src/service/apiServices/review.service";
import type { ProductReview } from "@/src/utils/types/product.type";
import { useCurrentUserQuery } from "@/src/service/react-query/user/query/useCurrentUserQuery";
import { useModalStore } from "@/src/components/providers/modalStoreProvider";

export default function ProductReviews({ productId }: { productId: string }) {
  const t = useTranslations();
  const { data: userData } = useCurrentUserQuery();
  const toggleLogin = useModalStore((state) => state.toggleLogin);
  const isLoggedIn = !!userData?.id;
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [summary, setSummary] = useState({
    averageRating: 0,
    reviewCount: 0,
    breakdown: {} as Record<number, number>,
  });
  const [eligibility, setEligibility] = useState<{
    eligible: boolean;
    hasReview: boolean;
    review?: ProductReview;
  }>();
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [notice, setNotice] = useState("");

  const load = () => {
    getReviews(productId)
      .then((r) => setReviews(r.data))
      .catch(() => {});
    getReviewSummary(productId)
      .then(setSummary)
      .catch(() => {});
    if (!isLoggedIn) {
      // The eligibility endpoint requires auth - skip it for guests rather
      // than letting it fail with a silently-swallowed 401.
      setEligibility(undefined);
      return;
    }
    setEligibilityLoading(true);
    getReviewEligibility(productId)
      .then((result) => {
        setEligibility(result);
        if (result.review) {
          setRating(result.review.rating);
          setTitle(result.review.title || "");
          setComment(result.review.comment);
        }
      })
      .catch(() => setEligibility(undefined))
      .finally(() => setEligibilityLoading(false));
  };
  useEffect(load, [productId, isLoggedIn]);

  const submit = async () => {
    if (eligibility?.review)
      await updateReview(productId, eligibility.review.id, {
        rating,
        title,
        comment,
      });
    else await createReview(productId, { rating, title, comment });
    setNotice(t("pendingApproval"));
    load();
  };

  return (
    <Reveal
      as="section"
      className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"
    >
      <h2 className="text-2xl font-bold tracking-tight text-slate-950">
        {t("reviews")}
      </h2>
      <div className="mt-3 flex items-center gap-3">
        <Rate disabled allowHalf value={summary.averageRating} />
        <b className="text-slate-950">{summary.averageRating.toFixed(1)}</b>
        <span className="text-slate-500">({summary.reviewCount})</span>
      </div>

      {!isLoggedIn ? (
        <div className="mt-6 rounded-xl bg-gradient-to-br from-violet-50 via-slate-50 to-blue-50 p-4">
          <p className="text-slate-700">{t("signInToWriteReview")}</p>
          <Button type="primary" className="mt-3" onClick={() => toggleLogin()}>
            {t("login")}
          </Button>
        </div>
      ) : (
        eligibility &&
        !eligibilityLoading &&
        !eligibility.eligible && (
          <div className="mt-6 rounded-xl bg-gradient-to-br from-violet-50 via-slate-50 to-blue-50 p-4">
            <p className="text-slate-700">{t("reviewsPurchaseRequired")}</p>
          </div>
        )
      )}

      {eligibility?.eligible && (
        <div className="mt-6 rounded-xl bg-gradient-to-br from-violet-50 via-slate-50 to-blue-50 p-4">
          <h3 className="font-bold text-slate-950">
            {eligibility.hasReview ? t("editReview") : t("writeReview")}
          </h3>
          <Rate value={rating} onChange={setRating} />
          <Input
            className="mt-3"
            value={title}
            maxLength={200}
            placeholder={t("reviewTitle")}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input.TextArea
            className="mt-3"
            rows={4}
            maxLength={5000}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t("reviewComment")}
          />
          <div className="mt-3 flex gap-2">
            <Button type="primary" disabled={!comment.trim()} onClick={submit}>
              {t("submitReview")}
            </Button>
            {eligibility.review && (
              <Button
                danger
                onClick={async () => {
                  await deleteReview(productId, eligibility.review!.id);
                  setNotice(t("reviewDeleted"));
                  setEligibility({
                    ...eligibility,
                    hasReview: false,
                    review: undefined,
                  });
                  setComment("");
                  load();
                }}
              >
                {t("deleteReview")}
              </Button>
            )}
          </div>
          {notice && (
            <p className="animate-fade-scale-in mt-3 font-medium text-violet-700">
              {notice}
            </p>
          )}
          {eligibility.review?.status && (
            <p className="mt-2 text-sm text-slate-500">
              {t("reviewStatus")}: {eligibility.review.status}
            </p>
          )}
        </div>
      )}

      <div className="mt-7 space-y-4">
        {reviews.length ? (
          reviews.map((r) => (
            <article key={r.id} className="border-t border-slate-200 pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <Rate disabled value={r.rating} />
                <b className="text-slate-950">{r.reviewerName}</b>
                {r.verifiedPurchase && (
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                    {t("verifiedPurchase")}
                  </span>
                )}
                <time className="text-xs text-slate-500">
                  {new Date(r.createdAt).toLocaleDateString()}
                </time>
              </div>
              {r.title && (
                <h3 className="mt-2 font-bold text-slate-950">{r.title}</h3>
              )}
              <p className="mt-1 text-sm whitespace-pre-wrap text-slate-700">
                {r.comment}
              </p>
            </article>
          ))
        ) : (
          <p className="text-slate-500">{t("noReviewsYet")}</p>
        )}
      </div>
    </Reveal>
  );
}
