"use client";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getRewardsService } from "@/src/service/apiServices/rewards.service";
import type { RewardsSummary } from "@/src/utils/types/rewards.type";
import { useStoreSettings } from "@/src/components/providers/StoreSettingsProvider";
import formatCurrency from "@/src/utils/functions/formatCurrency";
export default function ProfilePageRewardsTab() {
  const t = useTranslations(),
    locale = useLocale(),
    [data, setData] = useState<RewardsSummary>(),
    [error, setError] = useState(false),
    settings = useStoreSettings();
  useEffect(() => {
    getRewardsService()
      .then(setData)
      .catch(() => setError(true));
  }, []);
  if (error)
    return (
      <p className="rounded-xl bg-red-50 p-4 text-red-700">
        {t("rewardsLoadError")}
      </p>
    );
  if (!data)
    return (
      <div
        aria-label={t("loadingRewards")}
        className="h-32 animate-pulse rounded-xl bg-slate-100 motion-reduce:animate-none"
      />
    );
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-br from-[#1e1147] via-[#4c1d95] to-[#0b1740] p-6 text-white shadow-md shadow-violet-900/20">
          <p className="text-sm text-violet-300">{t("loyaltyPoints")}</p>
          <p className="mt-2 text-3xl font-bold">
            {data.pointsBalance.toLocaleString(locale)}
          </p>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50 p-6">
          <p className="text-sm text-violet-800">{t("cashback")}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {formatCurrency(
              data.cashbackBalance,
              settings.currencyCode,
              locale,
            )}
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-950">
          {t("recentRewardActivity")}
        </h3>
        <div className="mt-3 divide-y rounded-xl border border-slate-200">
          {data.recentTransactions.length ? (
            data.recentTransactions.map((tx) => (
              <div key={tx.id} className="flex justify-between gap-4 p-4">
                <div>
                  <p className="font-semibold text-slate-950">
                    {tx.description}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(tx.created_at).toLocaleDateString(locale)}
                  </p>
                </div>
                <p className="font-bold text-slate-950">
                  {tx.pointsAmount != null
                    ? `${tx.pointsAmount > 0 ? "+" : ""}${tx.pointsAmount} ${t("pointsAbbreviation")}`
                    : formatCurrency(
                        Number(tx.cashbackAmount || 0),
                        settings.currencyCode,
                        locale,
                      )}
                </p>
              </div>
            ))
          ) : (
            <p className="p-4 text-slate-500">{t("noRewardActivity")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
