"use client";

import { Button } from "antd";
import React, { useState } from "react";
import { AddressType } from "@/src/utils/types/address.type";
import { useUserAddressesQuery } from "@/src/service/react-query/user/query/useUserAddressesQuery";
import CreateAddressModal from "@/src/components/ui/modals/createAddressModal/CreateAddressModal";
import ProfilePageAddressItem from "@/src/components/pageComponents/profile/ProfilePageAddressItem";
import UpdateAddressModal from "@/src/components/ui/modals/updateAddressModal/UpdateAddressModal";
import { deleteAddressService } from "@/src/service/apiServices/address.service";
import { useTranslations } from "next-intl";

function ProfilePageAddressesTab() {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [showCreateAddressModal, setShowCreateAddressModal] = useState(false);
  const [editAddressModal, setEditAddressModal] = useState<AddressType | false>(
    false,
  );
  const { data, refetch, isLoading } = useUserAddressesQuery();

  const openCreateAddressForm = () => {
    setShowCreateAddressModal(true);
  };

  const openUpdateAddressForm = (address: AddressType) => {
    setEditAddressModal(address);
  };

  const deleteAddress = async (id: string) => {
    try {
      setLoading(true);
      await deleteAddressService(id);
      refetch();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={"flex flex-col gap-5"}>
      <Button
        loading={loading || isLoading}
        className={"w-fit px-10!"}
        onClick={openCreateAddressForm}
      >
        {t("addAddress")}
      </Button>
      <CreateAddressModal
        show={showCreateAddressModal}
        setShow={setShowCreateAddressModal}
      />
      <UpdateAddressModal
        show={editAddressModal ? editAddressModal : undefined}
        setShow={setEditAddressModal}
      />
      <div className={"flex flex-col gap-4"}>
        {data?.map((address, index) => (
          <div
            key={address.id}
            className="store-card-enter"
            style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
          >
            <ProfilePageAddressItem
              data={address}
              openUpdateAddressForm={openUpdateAddressForm}
              deleteAddress={deleteAddress}
              loading={loading || isLoading}
            ></ProfilePageAddressItem>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfilePageAddressesTab;
