import { Button, Form, Space, type FormProps } from "antd";
import TextInput from "../../inputs/TextInput.tsx";
import SelectInput from "../../inputs/SelectInput.tsx";
import FileInput from "../../inputs/FileInput.tsx";
import companyDetailOptions from "../../../../utils/contants/options/companyDetailOptions.ts";

interface Props extends FormProps {
  loading: boolean;
  onCancel: () => void;
  isEdit?: boolean;
}

function CompanyDetailForm({
  form,
  onFinish,
  loading,
  onCancel,
  isEdit,
  ...props
}: Props) {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      {...props}
    >
      <SelectInput
        formProps={{
          label: "Key",
          name: "key",
          required: true,
        }}
        inputProps={{
          options: companyDetailOptions,
        }}
      />
      <TextInput
        formProps={{
          label: "Value",
          name: "value",
          required: true,
        }}
        inputProps={{}}
      />
      <FileInput
        formProps={{
          label: "Image",
          name: "image",
        }}
        inputProps={{
          maxCount: 1,
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
            {isEdit ? "Edit Company" : "Add Company"}
          </Button>
          <Button onClick={onCancel} size="large">
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default CompanyDetailForm;
