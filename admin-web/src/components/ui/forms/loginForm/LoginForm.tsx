import { Button, Form, type FormProps } from "antd";
import TextInput from "../../inputs/TextInput.tsx";

function LoginForm(props: FormProps) {
  return (
    <Form {...props}>
      <TextInput
        formProps={{
          name: "username",
          label: "Username",
          rules: [{ required: true, message: "Please input your username!" }],
        }}
        inputProps={{
          type: "text",
          placeholder: "Enter your username",
          size: "large",
        }}
      ></TextInput>
      <TextInput
        formProps={{
          name: "password",
          label: "Password",
          rules: [{ required: true, message: "Please input your password!" }],
        }}
        inputProps={{
          type: "password",
          placeholder: "Enter your password",
          size: "large",
        }}
      ></TextInput>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          className="w-full"
        >
          Log In
        </Button>
      </Form.Item>
    </Form>
  );
}

export default LoginForm;
