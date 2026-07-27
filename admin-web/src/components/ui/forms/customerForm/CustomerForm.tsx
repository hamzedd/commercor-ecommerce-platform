import { Button, Form, Space, type FormProps, Input } from "antd";
import TextInput from "../../inputs/TextInput.tsx";
import type { CustomerType } from "../../../../utils/types/customerTypes.ts";

interface Props extends FormProps {
  loading: boolean;
  onCancel: () => void;
  isEdit?: boolean;
}

function CustomerForm({ form, onFinish, isEdit, loading, onCancel, ...props }: Props) {
  return (
    <Form<CustomerType>
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      {...props}
    >
      <TextInput
        formProps={{
          label: "First Name",
          name: "firstName",
          rules: [{ required: true, message: "Please enter First Name!" }],
        }}
        inputProps={{
          placeholder: "Enter First Name",
        }}
      ></TextInput>

      <TextInput
        formProps={{
          label: "Last Name",
          name: "lastName",
          rules: [{ required: true, message: "Please enter Last Name!" }],
        }}
        inputProps={{
          placeholder: "Enter Last Name",
        }}
      ></TextInput>

      <TextInput
        formProps={{
          label: "UserName",
          name: "username",
          rules: [{ required: true, message: "Please enter UserName!" }],
        }}
        inputProps={{
          placeholder: "Enter UserName Name",
        }}
      ></TextInput>

      <TextInput
        formProps={{
          label: "Email",
          name: "email",
          rules: [{ required: true, message: "Please enter Email!" }],
        }}
        inputProps={{
          placeholder: "Enter Email",
        }}
      ></TextInput>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please enter Password!" }]}
      >
        <Input.Password placeholder="Enter Password" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
          >
              {isEdit ? "Edit Customer" : "Add Customer"}
          </Button>
          <Button onClick={onCancel} size="large">
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default CustomerForm;
