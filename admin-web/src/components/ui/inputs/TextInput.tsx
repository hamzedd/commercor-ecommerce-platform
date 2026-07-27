import React from "react";
import { Form, Input } from "antd";

interface Props {
  inputProps?: React.ComponentProps<typeof Input>;
  formProps?: React.ComponentProps<typeof Form.Item>;
}
function TextInput({ inputProps, formProps }: Props) {
  return (
    <Form.Item {...formProps}>
      <Input {...inputProps} />
    </Form.Item>
  );
}

export default TextInput;
