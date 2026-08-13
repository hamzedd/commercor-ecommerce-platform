import React from "react";
import { Button, Form, FormProps } from "antd";
import TextInput from "@/src/components/ui/inputs/TextInput";
import { useTranslations } from "next-intl";

function RegisterForm(props: FormProps) {
  const t=useTranslations();
  return (
    <Form layout={"vertical"} {...props}>
      <TextInput
        formProps={{ name: "firstName", label: t("firstName") }} inputProps={{ placeholder: t("enterFirstName") }}
      />
      <TextInput
        formProps={{ name: "lastName", label: t("lastName") }} inputProps={{ placeholder: t("enterLastName") }}
      />
      <TextInput
        formProps={{ name: "username", label: t("username") }} inputProps={{ placeholder: t("enterUsername") }}
      />
      <TextInput
        formProps={{ name: "email", label: t("email") }} inputProps={{ placeholder: t("enterEmail"), type: "email" }}
      />
      <TextInput
        formProps={{ name: "password", label: t("password") }} inputProps={{ placeholder: t("enterPassword"), type: "password" }}
      />
      <Form.Item>
        <Button htmlType={"submit"}>{t("register")}</Button>
      </Form.Item>
    </Form>
  );
}

export default RegisterForm;
