import { Button, Form, type FormProps } from "antd";
import SelectInput from "../../inputs/SelectInput.tsx";
import type { FormOptionType } from "../../../../utils/types/formTypes.ts";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface Props extends FormProps {
  filterOptions: { id: string; title: string; options: FormOptionType[] };
}

function ProductFilterValueForm({
  form,
  onFinish,
  filterOptions,
  ...props
}: Props) {
  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        className={"w-full"}
        {...props}
      >
        <div className="flex gap-2 w-full">
          <SelectInput
            inputProps={{
              options: filterOptions.options,
              placeholder: "Select Filter",
            }}
            formProps={{
              className: "grow",
              label: filterOptions.title,
              name: "filterOptionId",
              rules: [{ required: true, message: "Please select Filter" }],
            }}
          />
          <Form.Item className={"items-end flex gap-1"}>
            <Button type={"primary"} htmlType={"submit"}>
              <EditOutlined />
            </Button>
            <Button htmlType={"reset"} className={"ml-1"}>
              <DeleteOutlined />
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
}

export default ProductFilterValueForm;
