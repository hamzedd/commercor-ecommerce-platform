"use client";
import { useState } from "react";
import { CheckOutlined } from "@ant-design/icons";
import DefaultModal from "@/src/components/ui/modals/defaultModal/DefaultModal";
import LoginForm from "@/src/components/ui/forms/LoginForm";
import { Form } from "antd";
import { customerLoginService } from "@/src/service/apiServices/auth.service";
import { CustomerLoginRequestType } from "@/src/utils/types/customer.type";
import { useCurrentUserQuery } from "@/src/service/react-query/user/query/useCurrentUserQuery";
import { useModalStore } from "@/src/components/providers/modalStoreProvider";
import { syncGuestCartToServer } from "@/src/utils/cart/cartStorage";
import { useTranslations } from "next-intl";

interface Props {
  handleOpenRegisterModal?: () => void;
}
function LoginModal({ handleOpenRegisterModal }: Props) {
  const t = useTranslations();
  const toggleLogin = useModalStore((state) => state.toggleLogin);
  const loginModal = useModalStore((state) => state.loginModal);
  const { refetch } = useCurrentUserQuery();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: CustomerLoginRequestType) => {
    try {
      setLoading(true);
      setShake(false);
      const res = await customerLoginService(values);
      if (res?.accessToken) {
        window.localStorage.setItem("accessToken", res.accessToken);
        await syncGuestCartToServer();
        setLoading(false);
        setSuccess(true);
        await new Promise((resolve) => setTimeout(resolve, 900));
        toggleLogin();
        form.resetFields();
        refetch();
        setSuccess(false);
      }
    } catch {
      setShake(true);
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
      {success ? (
        <div className="animate-fade-scale-in flex w-full max-w-[500px] flex-col items-center gap-3 py-8 text-center">
          <span className="animate-success-check flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
            <CheckOutlined aria-hidden />
          </span>
        </div>
      ) : (
        <>
          <LoginForm
            onFinish={handleSubmit}
            className={`w-full max-w-[500px] ${shake ? "animate-shake" : ""}`}
            form={form}
            disabled={loading}
            submitting={loading}
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
              "btn-press w-full max-w-[500px] rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-center font-semibold text-slate-700 transition-all duration-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:outline-none"
            }
            onClick={handleOpenRegisterModal}
          >
            {t("register")}
          </button>
        </>
      )}
    </DefaultModal>
  );
}

export default LoginModal;
