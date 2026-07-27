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
      className={"flex justify-between rounded-md border border-gray-300 p-4"}
    >
      <div className="flex flex-col gap-2">
        <strong className={"text-xl"}>{address?.detail}</strong>
        <p className={"text-sm"}>{address.street}</p>
        <p className={"text-sm"}>
          {address.country}, {address.city}
        </p>
        <p className={"text-lg font-medium"}>
          {t("phone")}: {address.phoneNumber}
        </p>
      </div>
      <div className="flex flex-col justify-between">
        <button
          type={"button"}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-black"
          onClick={() => openUpdateAddressForm(address)}
          disabled={loading}
        >
          <EditOutlined style={{ color: "#fff", fontSize: 20 }} />
        </button>
        <button
          type={"button"}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-black"
          onClick={() => deleteAddress(address.id)}
          disabled={loading}
        >
          <DeleteOutlined style={{ color: "#fff", fontSize: 20 }} />
        </button>
      </div>
    </div>
  );
}

export default ProfilePageAddressItem;
