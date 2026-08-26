"use client";

import {
  CheckCircleFilled,
  EnvironmentOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";

import { useUserAddressesQuery } from "@/src/service/react-query/user/query/useUserAddressesQuery";
interface Props {
  onAddressSelect: (id: string) => void;
  selectedAddressId: string;
}

function CheckoutAddressList({ onAddressSelect, selectedAddressId }: Props) {
  const t = useTranslations();
  const { data: addresses, isLoading, error } = useUserAddressesQuery();

  if (isLoading) {
    return (
      <section aria-busy="true" aria-labelledby="delivery-address-heading">
        <h3
          id="delivery-address-heading"
          className="text-lg font-bold text-slate-950"
        >
          {t("deliveryAddress")}
        </h3>
        <div className="mt-3 space-y-3">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-xl border border-slate-200 bg-slate-100 motion-reduce:animate-none"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
      >
        {t("failedToLoadAddresses")}
      </div>
    );
  }

  return (
    <section aria-labelledby="delivery-address-heading">
      <div className="flex items-center gap-2">
        <EnvironmentOutlined className="text-violet-700" aria-hidden />
        <h3
          id="delivery-address-heading"
          className="text-lg font-bold text-slate-950"
        >
          {t("deliveryAddress")}
        </h3>
      </div>

      {!addresses || addresses.length === 0 ? (
        <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
          <p className="text-sm leading-6 text-slate-600">
            {t("noAddressesFound")}
          </p>
          <button
            type="button"
            className="mx-auto mt-4 flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-violet-900/20 transition-all duration-200 hover:shadow-md hover:shadow-violet-800/30 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <PlusOutlined aria-hidden />
            {t("addAddress")}
          </button>
        </div>
      ) : (
        <div
          className="mt-3 space-y-3"
          role="radiogroup"
          aria-label={t("deliveryAddress")}
        >
          {addresses.map((address) => {
            const isSelected = selectedAddressId === address.id;
            return (
              <button
                key={address.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onAddressSelect(address.id)}
                className={`w-full rounded-xl border p-4 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:outline-none ${
                  isSelected
                    ? "scale-[1.01] border-violet-600 bg-violet-50 shadow-sm shadow-violet-500/10"
                    : "border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/40"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-transform duration-200 ${isSelected ? "store-pop scale-110 border-violet-600 text-violet-700" : "border-slate-300 text-transparent"}`}
                  >
                    <CheckCircleFilled aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold text-slate-950">
                      {address.street}
                    </span>
                    <span className="mt-1 block text-sm leading-5 text-slate-600">
                      {address.detail && (
                        <>
                          {address.detail}
                          <br />
                        </>
                      )}
                      {address.city}, {address.country}
                    </span>
                    <span className="mt-2 block text-sm text-slate-500">
                      {t("phone")}: {address.phoneNumber}
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default CheckoutAddressList;
