import React, { useEffect, useState } from "react";
import DefaultModal from "@/src/components/ui/modals/defaultModal/DefaultModal";
import { Form } from "antd";
import { useUserAddressesQuery } from "@/src/service/react-query/user/query/useUserAddressesQuery";
import {
  AddressType,
  CreateAddressRequestType,
} from "@/src/utils/types/address.type";
import { updateAddressService } from "@/src/service/apiServices/address.service";
import AddressForm from "@/src/components/ui/forms/AddressForm";
import { useTranslations } from "next-intl";

interface Props {
  show?: AddressType;
  setShow: (visible: AddressType | false) => void;
}

function UpdateAddressModal({ show, setShow }: Props) {
  const t = useTranslations();
  const { refetch } = useUserAddressesQuery();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: CreateAddressRequestType) => {
    if (!show?.id) return;
    try {
      setLoading(true);
      await updateAddressService(show.id, values);
      setShow(false);
      form.resetFields();
      refetch();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show?.id) {
      form.setFieldsValue(show);
    }
  }, [show?.id, form]);

  return (
    <DefaultModal
      title={t("updateAddress")}
      onClose={() => setShow(false)}
      show={!!show?.id}
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

export default UpdateAddressModal;
