import { Button, Form, Space, type FormProps } from "antd";
import type { BrandType } from "../../../../utils/types/brandTypes.ts";
import { useState } from "react";
import EditableLangTabs from "../../tabs/EditableLangTabs.tsx";
import BrandTranslationFields from "./components/BrandTranslationFields.tsx";
import type { FormLanguageType } from "../../../../utils/types/formTypes.ts";
import FileInput from "../../inputs/FileInput.tsx";
import NumberInput from "../../inputs/NumberInput.tsx";
import countriesOptions from "./components/countriesOptions.ts";

interface Props extends FormProps {
  loading: boolean;
  onCancel: () => void;
  isEdit?: boolean;
}

function BrandForm({
  form,
  onFinish,
  loading,
  onCancel,
  isEdit,
  ...props
}: Props) {
  const [activeLangTab, setActiveLangTab] = useState(countriesOptions[0].value);
  const [languages, setLanguages] = useState<FormLanguageType[]>(
    props?.initialValues
      ? props.initialValues?.translations?.map((t: any) => ({
          label: t.lang,
          key: t.lang,
        }))
      : [countriesOptions[0]],
  );

  return (
    <>
      <EditableLangTabs
        languages={languages}
        setLanguages={setLanguages}
        activeKey={activeLangTab}
        setActiveKey={setActiveLangTab}
      />
      <Form<BrandType>
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        {...props}
      >
        <NumberInput
          formProps={{
            label: "Rank",
            name: "rank",
            rules: [{ required: true, message: "Please enter rank!" }],
          }}
          inputProps={{ placeholder: "Enter rank", style: { width: "100%" } }}
        />

        {languages?.map((language, index) => (
          <BrandTranslationFields
            className={`${language.key === activeLangTab ? "block" : "hidden"}`}
            key={language.key}
            languageCode={language.key}
            index={index}
          />
        ))}

        <FileInput
          formProps={{
            label: "Brand Image",
            name: "image",
          }}
          inputProps={{
            maxCount: 1,
          }}
        ></FileInput>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
            >
              {isEdit ? "Edit Brand" : "Add Brand"}
            </Button>
            <Button onClick={onCancel} size="large">
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
}

export default BrandForm;
