"use client";

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
  const t = useTranslations();
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
    <DefaultModal
      title={t("register")}
      onClose={() => setShow(false)}
      show={show}
    >
      <RegisterForm
        onFinish={handleSubmit}
        className={"w-full max-w-[500px]"}
        form={form}
        disabled={loading}
      />
      <div className="flex w-full items-center justify-center gap-5">
        <div className={"h-[1px] w-full grow bg-slate-200"}></div>
        <p
          className={
            "text-xs font-bold tracking-[0.16em] text-slate-400 uppercase"
          }
        >
          {t("or")}
        </p>
        <div className={"h-[1px] w-full grow bg-slate-200"}></div>
      </div>
      <button
        type={"button"}
        className={
          "w-full max-w-[500px] rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-center font-semibold text-slate-700 transition-all duration-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none"
        }
        onClick={handleOpenLoginModal}
      >
        {t("login")}
      </button>
    </DefaultModal>
  );
}

export default RegisterModal;
