import React from "react";
import { Form, InputNumber } from "antd";

interface Props {
  inputProps?: React.ComponentProps<typeof InputNumber>;
  formProps?: React.ComponentProps<typeof Form.Item>;
}
function NumberInput({ inputProps, formProps }: Props) {
  return (
    <Form.Item {...formProps}>
      <InputNumber {...inputProps} />
    </Form.Item>
  );
}

export default NumberInput;
