import React from "react";
import { Form, Input } from "antd";
import type { TextAreaProps } from "antd/es/input";

interface Props {
  inputProps?: TextAreaProps;
  formProps?: React.ComponentProps<typeof Form.Item>;
}
function TextAreaInput({ inputProps, formProps }: Props) {
  return (
    <Form.Item {...formProps}>
      <Input.TextArea {...inputProps} />
    </Form.Item>
  );
}

export default TextAreaInput;
