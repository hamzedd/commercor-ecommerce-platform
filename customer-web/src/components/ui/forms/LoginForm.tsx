import React from "react";
import { Button, Form, FormProps } from "antd";
import TextInput from "@/src/components/ui/inputs/TextInput";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";

function LoginForm(props: FormProps) {
  const t=useTranslations();
  return (
    <Form layout={"vertical"} {...props}>
      <TextInput
        formProps={{ name: "username", label: "Username" }}
        inputProps={{ placeholder: "Enter your username" }}
      />
      <TextInput
        formProps={{ name: "password", label: "Password" }}
        inputProps={{ placeholder: "Enter your password", type: "password" }}
      />
      <Form.Item>
        <Button htmlType={"submit"}>Login</Button>
      </Form.Item>
      <Link href="/forgot-password" className="text-blue-700 hover:underline">{t('forgotPassword')}</Link>
    </Form>
  );
}

export default LoginForm;
