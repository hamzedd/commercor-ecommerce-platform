import { Form, type FormItemProps, Upload, type UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface Props {
  formProps: FormItemProps;
  inputProps: UploadProps;
}

const uploadButton = (
  <button style={{ border: 0, background: "none" }} type="button">
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </button>
);

function FileInput({ inputProps, formProps }: Props) {
  return (
    <Form.Item {...formProps}>
      <Upload
        listType="picture-card"
        beforeUpload={() => false}
        {...inputProps}
      >
        {uploadButton}
      </Upload>
    </Form.Item>
  );
}

export default FileInput;
