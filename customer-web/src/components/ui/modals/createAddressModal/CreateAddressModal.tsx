import React, { useState } from "react";
import DefaultModal from "@/src/components/ui/modals/defaultModal/DefaultModal";
import { Form } from "antd";
import { useUserAddressesQuery } from "@/src/service/react-query/user/query/useUserAddressesQuery";
import { CreateAddressRequestType } from "@/src/utils/types/address.type";
import { createAddressService } from "@/src/service/apiServices/address.service";
import AddressForm from "@/src/components/ui/forms/AddressForm";
import { useTranslations } from "next-intl";

interface Props {
  show: boolean;
  setShow: (visible: boolean) => void;
}

function CreateAddressModal({ show, setShow }: Props) {
  const t = useTranslations();
  const { refetch } = useUserAddressesQuery();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: CreateAddressRequestType) => {
    try {
      setLoading(true);
      await createAddressService(values);
      setShow(false);
      form.resetFields();
      refetch();
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultModal
      title={t("createAddress")}
      onClose={() => setShow(false)}
      show={show}
    >
      <AddressForm
        layout={"vertical"}
        onFinish={handleSubmit}
        className={"w-full max-w-[500px]"}
        form={form}
        disabled={loading}
      />
    </DefaultModal>
  );
}

export default CreateAddressModal;
