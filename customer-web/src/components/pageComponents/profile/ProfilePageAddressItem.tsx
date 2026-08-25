import React from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { AddressType } from "@/src/utils/types/address.type";
import { useTranslations } from "next-intl";

interface Props {
  data: AddressType;
  openUpdateAddressForm: (address: AddressType) => void;
  deleteAddress: (id: AddressType["id"]) => void;
  loading: boolean;
}

function ProfilePageAddressItem({
  data: address,
  openUpdateAddressForm,
  deleteAddress,
  loading,
}: Props) {
  const t = useTranslations();

  return (
    <div
      key={address.id}
      className="flex justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md hover:shadow-violet-950/5"
    >
      <div className="flex flex-col gap-2">
        <strong className="text-xl text-slate-950">{address?.detail}</strong>
        <p className="text-sm text-slate-600">{address.street}</p>
        <p className="text-sm text-slate-600">
          {address.country}, {address.city}
        </p>
        <p className="text-lg font-medium text-slate-800">
          {t("phone")}: {address.phoneNumber}
        </p>
      </div>
      <div className="flex flex-col justify-between gap-2">
        <button
          type={"button"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none disabled:opacity-50"
          onClick={() => openUpdateAddressForm(address)}
          disabled={loading}
        >
          <EditOutlined style={{ fontSize: 18 }} />
        </button>
        <button
          type={"button"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none disabled:opacity-50"
          onClick={() => deleteAddress(address.id)}
          disabled={loading}
        >
          <DeleteOutlined style={{ fontSize: 18 }} />
        </button>
      </div>
    </div>
  );
}

export default ProfilePageAddressItem;
