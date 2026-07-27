import { Button, Form, Space, type FormProps, Input } from "antd";
import TextInput from "../../inputs/TextInput.tsx";
import SelectInput from "../../inputs/SelectInput.tsx";
import type { UserType } from "../../../../utils/types/userTypes.ts";
import { USER_ROLE_OPTIONS } from "../../../../utils/contants/options/userRoleOptions.ts";

interface Props extends FormProps {
  loading: boolean;
  onCancel: () => void;
  isEdit?: boolean;
}

function UserForm({
  form,
  onFinish,
  isEdit,
  loading,
  onCancel,
  ...props
}: Props) {
  return (
    <Form<UserType>
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      {...props}
    >
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

      <SelectInput
        inputProps={{
          options: USER_ROLE_OPTIONS,
          placeholder: "Select Role",
          allowClear: true,
        }}
        formProps={{
          label: "Role ",
          name: "role",
        }}
      />
      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
          >
            {isEdit ? "Edit User" : "Add User"}
          </Button>
          <Button onClick={onCancel} size="large">
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default UserForm;
