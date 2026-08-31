import { Form, type FormItemProps } from "antd";
import type { FormOptionType } from "../../../utils/types/formTypes.ts";

interface NativeSelectProps {
  value?: string | number | null;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  options?: FormOptionType[];
}

function NativeSelect({
  value,
  onChange,
  disabled,
  placeholder,
  options,
}: NativeSelectProps) {
  return (
    <select
      value={value != null ? String(value) : ""}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      className="admin-native-select"
    >
      <option value="" disabled>
        {placeholder ?? "Select"}
      </option>
      {options?.map((option) => (
        <option key={String(option.value)} value={String(option.value)}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface Props {
  formProps: FormItemProps;
  inputProps: NativeSelectProps;
}

function NativeSelectInput({ inputProps, formProps }: Props) {
  return (
    <Form.Item {...formProps}>
      <NativeSelect {...inputProps} />
    </Form.Item>
  );
}

export default NativeSelectInput;
