import { useEffect, useRef, useState } from "react";
import { Form, type FormItemProps } from "antd";
import { CloseOutlined, DownOutlined } from "@ant-design/icons";
import type { FormOptionType } from "../../../utils/types/formTypes.ts";

export interface NativeMultiSelectProps {
  value?: (string | number)[] | null;
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  options?: FormOptionType[];
  className?: string;
}

export function NativeMultiSelect({
  value,
  onChange,
  disabled,
  placeholder,
  options,
  className,
}: NativeMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = (value ?? []).map(String);

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggleValue = (optionValue: string) => {
    const next = selected.includes(optionValue)
      ? selected.filter((v) => v !== optionValue)
      : [...selected, optionValue];
    onChange?.(next);
  };

  const removeValue = (optionValue: string) => {
    onChange?.(selected.filter((v) => v !== optionValue));
  };

  const labelFor = (optionValue: string) =>
    options?.find((o) => String(o.value) === optionValue)?.label ?? optionValue;

  return (
    <div
      ref={rootRef}
      className={["admin-native-multiselect", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={open}
        aria-disabled={disabled}
        className={[
          "admin-native-multiselect-trigger",
          disabled ? "is-disabled" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((prev) => !prev);
          }
        }}
      >
        <div className="admin-native-multiselect-chips">
          {selected.length === 0 && (
            <span className="admin-native-multiselect-placeholder">
              {placeholder ?? "Select"}
            </span>
          )}
          {selected.map((v) => (
            <span key={v} className="admin-native-multiselect-chip">
              {labelFor(v)}
              <button
                type="button"
                aria-label={`Remove ${labelFor(v)}`}
                className="admin-native-multiselect-chip-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  removeValue(v);
                }}
              >
                <CloseOutlined />
              </button>
            </span>
          ))}
        </div>
        <DownOutlined className="admin-native-multiselect-arrow" />
      </div>
      {open && !disabled && (
        <div className="admin-native-multiselect-panel" role="listbox">
          {options?.length ? (
            options.map((option) => {
              const optionValue = String(option.value);
              const checked = selected.includes(optionValue);
              return (
                <label
                  key={optionValue}
                  className="admin-native-multiselect-option"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleValue(optionValue)}
                  />
                  <span>{option.label}</span>
                </label>
              );
            })
          ) : (
            <div className="admin-native-multiselect-empty">No options</div>
          )}
        </div>
      )}
    </div>
  );
}

interface Props {
  formProps: FormItemProps;
  inputProps: NativeMultiSelectProps;
}

function NativeMultiSelectInput({ inputProps, formProps }: Props) {
  return (
    <Form.Item {...formProps}>
      <NativeMultiSelect
        {...inputProps}
        className={["w-full", inputProps.className].filter(Boolean).join(" ")}
      />
    </Form.Item>
  );
}

export default NativeMultiSelectInput;
