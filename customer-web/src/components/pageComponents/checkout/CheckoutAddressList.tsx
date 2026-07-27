import React from "react";
import { useUserAddressesQuery } from "@/src/service/react-query/user/query/useUserAddressesQuery";
import { AddressType } from "@/src/utils/types/address.type";
import { CheckCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

interface Props {
  onAddressSelect: (id: string) => void;
  selectedAddressId: string;
}

function CheckoutAddressList({ onAddressSelect, selectedAddressId }: Props) {
  const t = useTranslations();
  const { data: addresses, isLoading, error } = useUserAddressesQuery();

  const handleSelectAddress = (address: AddressType) => {
    if (onAddressSelect) {
      onAddressSelect(address.id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">{t("deliveryAddress")}</h3>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-lg border bg-gray-100"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">{t("failedToLoadAddresses")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{t("deliveryAddress")}</h3>

      {!addresses || addresses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <p className="mb-3 text-sm text-gray-600">{t("noAddressesFound")}</p>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            <PlusOutlined className="h-4 w-4" />
            {t("addAddress")}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {addresses.map((address) => {
            const isSelected = selectedAddressId === address.id;
            return (
              <button
                key={address.id}
                type="button"
                onClick={() => handleSelectAddress(address)}
                className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                  isSelected
                    ? "border-black bg-gray-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      {isSelected && (
                        <CheckCircleOutlined className="h-5 w-5 text-black" />
                      )}
                      <h4 className="font-medium text-gray-900">
                        {address.street}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {address.detail && (
                        <>
                          {address.detail}
                          <br />
                        </>
                      )}
                      {address.city}, {address.country}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {t("phone")}: {address.phoneNumber}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CheckoutAddressList;
