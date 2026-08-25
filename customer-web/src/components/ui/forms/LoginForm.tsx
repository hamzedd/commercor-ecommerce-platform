import React from "react";
import { Button, Form, FormProps } from "antd";
import TextInput from "@/src/components/ui/inputs/TextInput";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";

function LoginForm(props: FormProps) {
  const t = useTranslations();
  return (
    <Form layout={"vertical"} {...props}>
      <TextInput
        formProps={{ name: "username", label: t("username") }}
        inputProps={{ placeholder: t("enterUsername") }}
      />
      <TextInput
        formProps={{ name: "password", label: t("password") }}
        inputProps={{ placeholder: t("enterPassword"), type: "password" }}
      />
      <Form.Item>
        <Button
          htmlType={"submit"}
          block
          className="!h-11 !rounded-xl !border-0 !bg-gradient-to-r !from-blue-600 !via-violet-600 !to-pink-600 !font-bold !text-white !shadow-md !shadow-violet-900/20 transition-transform duration-200 hover:!scale-[1.02] focus-visible:!ring-2 focus-visible:!ring-violet-500 focus-visible:!ring-offset-2"
        >
          {t("login")}
        </Button>
      </Form.Item>
      <Link
        href="/forgot-password"
        className="font-medium text-violet-700 hover:text-violet-900 hover:underline"
      >
        {t("forgotPassword")}
      </Link>
    </Form>
  );
}

export default LoginForm;
