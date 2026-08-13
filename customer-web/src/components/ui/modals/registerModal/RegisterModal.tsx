import React, { useState } from "react";
import DefaultModal from "@/src/components/ui/modals/defaultModal/DefaultModal";
import { Form } from "antd";
import RegisterForm from "@/src/components/ui/forms/RegisterForm";
import { RegisterCustomerRequestType } from "@/src/utils/types/customer.type";
import { registerCustomerService } from "@/src/service/apiServices/customer.service";
import { useTranslations } from "next-intl";

interface Props {
  show: boolean;
  setShow: (visible: boolean) => void;
  handleOpenLoginModal: () => void;
}
function RegisterModal({ show, setShow, handleOpenLoginModal }: Props) {
  const t=useTranslations();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: RegisterCustomerRequestType) => {
    try {
      setLoading(true);
      await registerCustomerService(values);
      setShow(false);
      form.resetFields();
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <DefaultModal title={t("register")} onClose={() => setShow(false)} show={show}>
      <RegisterForm
        onFinish={handleSubmit}
        className={"w-full max-w-[500px]"}
        form={form}
        disabled={loading}
      />
      <div className="flex w-full items-center justify-center gap-5">
        <div className={"h-[1px] w-full grow bg-gray-500/20"}></div>
        <p className={"font-semibold uppercase"}>{t("or")}</p>
        <div className={"h-[1px] w-full grow bg-gray-500/20"}></div>
      </div>
      <button
        type={"button"}
        className={
          "w-full max-w-[500px] rounded-md border border-gray-300 bg-white px-4 py-2 text-center shadow-sm hover:bg-gray-100"
        }
        onClick={handleOpenLoginModal}
      >
        {t("login")}
      </button>
    </DefaultModal>
  );
}

export default RegisterModal;
