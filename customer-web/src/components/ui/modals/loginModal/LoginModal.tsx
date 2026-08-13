"use client";
import { useState } from "react";
import DefaultModal from "@/src/components/ui/modals/defaultModal/DefaultModal";
import LoginForm from "@/src/components/ui/forms/LoginForm";
import { Form } from "antd";
import { customerLoginService } from "@/src/service/apiServices/auth.service";
import { CustomerLoginRequestType } from "@/src/utils/types/customer.type";
import { useCurrentUserQuery } from "@/src/service/react-query/user/query/useCurrentUserQuery";
import { useModalStore } from "@/src/components/providers/modalStoreProvider";
import { syncGuestCartToServer } from '@/src/utils/cart/cartStorage';
import { useTranslations } from 'next-intl';

interface Props {
  handleOpenRegisterModal?: () => void;
}
function LoginModal({ handleOpenRegisterModal }: Props) {
  const t=useTranslations();
  const toggleLogin = useModalStore((state) => state.toggleLogin);
  const loginModal = useModalStore((state) => state.loginModal);
  const { refetch } = useCurrentUserQuery();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: CustomerLoginRequestType) => {
    try {
      setLoading(true);
      const res = await customerLoginService(values);
      if (res?.accessToken) {
        window.localStorage.setItem("accessToken", res.accessToken);
        await syncGuestCartToServer();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toggleLogin();
        form.resetFields();
        refetch();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultModal
      title={t("login")}
      onClose={() => toggleLogin()}
      show={loginModal}
    >
      <LoginForm
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
        onClick={handleOpenRegisterModal}
      >
        {t("register")}
      </button>
    </DefaultModal>
  );
}

export default LoginModal;
