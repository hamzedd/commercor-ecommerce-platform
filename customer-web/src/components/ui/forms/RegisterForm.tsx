import React from "react";
import { Button, Form, FormProps } from "antd";
import TextInput from "@/src/components/ui/inputs/TextInput";

function RegisterForm(props: FormProps) {
  return (
    <Form layout={"vertical"} {...props}>
      <TextInput
        formProps={{ name: "firstName", label: "First Name" }}
        inputProps={{ placeholder: "Enter your First Name" }}
      />
      <TextInput
        formProps={{ name: "lastName", label: "Last Name" }}
        inputProps={{ placeholder: "Enter your Last Name" }}
      />
      <TextInput
        formProps={{ name: "username", label: "Username" }}
        inputProps={{ placeholder: "Enter your username" }}
      />
      <TextInput
        formProps={{ name: "email", label: "Email" }}
        inputProps={{ placeholder: "Enter your email", type: "email" }}
      />
      <TextInput
        formProps={{ name: "password", label: "Password" }}
        inputProps={{ placeholder: "Enter your password", type: "password" }}
      />
      <Form.Item>
        <Button htmlType={"submit"}>Register</Button>
      </Form.Item>
    </Form>
  );
}

export default RegisterForm;
