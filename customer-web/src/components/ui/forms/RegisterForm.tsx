import React from "react";
import { Button, Form, FormProps } from "antd";
import TextInput from "@/src/components/ui/inputs/TextInput";
import { useTranslations } from "next-intl";

function RegisterForm(props: FormProps) {
  const t = useTranslations();
  return (
    <Form layout={"vertical"} {...props}>
      <TextInput
        formProps={{ name: "firstName", label: t("firstName") }}
        inputProps={{ placeholder: t("enterFirstName") }}
      />
      <TextInput
        formProps={{ name: "lastName", label: t("lastName") }}
        inputProps={{ placeholder: t("enterLastName") }}
      />
      <TextInput
        formProps={{ name: "username", label: t("username") }}
        inputProps={{ placeholder: t("enterUsername") }}
      />
      <TextInput
        formProps={{ name: "email", label: t("email") }}
        inputProps={{ placeholder: t("enterEmail"), type: "email" }}
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
          {t("register")}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default RegisterForm;
