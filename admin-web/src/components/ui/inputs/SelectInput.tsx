import { Form, type FormItemProps, Select, type SelectProps } from "antd";

interface Props {
  formProps: FormItemProps;
  inputProps: SelectProps;
}

function SelectInput({ inputProps, formProps }: Props) {
  return (
    <Form.Item {...formProps}>
      <Select {...inputProps} />
    </Form.Item>
  );
}

export default SelectInput;
