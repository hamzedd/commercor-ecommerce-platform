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
          className="text-lg font-bold text-stone-950"
        >
          {t("deliveryAddress")}
        </h3>
        <div className="mt-3 space-y-3">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-xl border border-stone-200 bg-stone-100 motion-reduce:animate-none"
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
        <EnvironmentOutlined className="text-amber-700" aria-hidden />
        <h3
          id="delivery-address-heading"
          className="text-lg font-bold text-stone-950"
        >
          {t("deliveryAddress")}
        </h3>
      </div>

      {!addresses || addresses.length === 0 ? (
        <div className="mt-3 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-5 text-center">
          <p className="text-sm leading-6 text-stone-600">
            {t("noAddressesFound")}
          </p>
          <button
            type="button"
            className="mx-auto mt-4 flex min-h-11 items-center gap-2 rounded-xl bg-stone-950 px-4 py-2 text-sm font-bold text-white transition-colors duration-200 hover:bg-amber-600 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none"
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
                className={`w-full rounded-xl border p-4 text-left transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none ${
                  isSelected
                    ? "border-amber-600 bg-amber-50"
                    : "border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${isSelected ? "border-amber-600 text-amber-700" : "border-stone-300 text-transparent"}`}
                  >
                    <CheckCircleFilled aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold text-stone-950">
                      {address.street}
                    </span>
                    <span className="mt-1 block text-sm leading-5 text-stone-600">
                      {address.detail && (
                        <>
                          {address.detail}
                          <br />
                        </>
                      )}
                      {address.city}, {address.country}
                    </span>
                    <span className="mt-2 block text-sm text-stone-500">
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
