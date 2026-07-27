import React from "react";
import { Button, Form, FormProps } from "antd";
import TextInput from "@/src/components/ui/inputs/TextInput";

function LoginForm(props: FormProps) {
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
    </Form>
  );
}

export default LoginForm;
