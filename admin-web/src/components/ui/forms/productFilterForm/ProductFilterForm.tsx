import { Form, type FormProps, Button, Space } from "antd";
import EditableLangTabs from "../../tabs/EditableLangTabs.tsx";
import { useEffect, useState } from "react";
import NativeSelectInput from "../../inputs/NativeSelectInput.tsx";
import NativeMultiSelectInput from "../../inputs/NativeMultiSelectInput.tsx";
import ProductFilterTranslationForm from "./components/ProductFilterTranslationForm.tsx";
import { getProductFilterTypesService } from "../../../../service/apiServices/productFilterServices.ts";
import type { ProductFilterTypeType } from "../../../../utils/types/productFilterTypes.ts";
import type { FormLanguageType } from "../../../../utils/types/formTypes.ts";
import type { ProductFilterType } from "../../../../utils/types/productFilterTypes.ts";
import countriesOptions from "../brandForm/components/countriesOptions.ts";
import { getCategoriesService } from "../../../../service/apiServices/categoryServices.ts";
import type { FormOptionType } from "../../../../utils/types/formTypes.ts";

interface Props extends FormProps {
  loading: boolean;
  onCancel: () => void;
  isEdit?: boolean;
}

function ProductFilterForm({ onFinish, form, isEdit, ...props }: Props) {
  const [typeOptions, setTypeOptions] = useState<ProductFilterTypeType[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<FormOptionType[]>([]);
  const [activeLangTab, setActiveLangTab] = useState(countriesOptions[0].value);
  const [languages, setLanguages] = useState<FormLanguageType[]>(
    props?.initialValues
      ? props.initialValues?.translations?.map((t: any) => ({
          label: t.lang,
          key: t.lang,
        }))
      : [countriesOptions[0]],
  );

  const { loading, onCancel } = props;

  useEffect(() => {
    const getProductFilterOptions = async () => {
      const [types, categories] = await Promise.all([
        getProductFilterTypesService(),
        getCategoriesService(),
      ]);
      setTypeOptions(types);
      setCategoryOptions(
        categories.map((category) => ({
          label: category.translations?.[0]?.name || category.id,
          value: category.id,
        })),
      );
    };
    void getProductFilterOptions();
  }, []);

  return (
    <>
      <EditableLangTabs
        languages={languages}
        setLanguages={setLanguages}
        activeKey={activeLangTab}
        setActiveKey={setActiveLangTab}
      />
      <Form<ProductFilterType>
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        {...props}
      >
        <NativeSelectInput
          formProps={{
            name: "type",
            label: "Filter Type",
            rules: [{ required: true, message: "Please select a filter type" }],
          }}
          inputProps={{
            placeholder: "Select filter type",
            options: typeOptions.map((type) => ({
              label: type.key,
              value: type.value,
            })),
          }}
        ></NativeSelectInput>
        <NativeMultiSelectInput
          formProps={{
            name: "categoryIds",
            label: "Categories",
            initialValue: [],
          }}
          inputProps={{
            placeholder: "Select categories",
            options: categoryOptions,
          }}
        />
        {languages?.map((language, index) => (
          <ProductFilterTranslationForm
            className={`${language.key === activeLangTab ? "block" : "hidden"}`}
            key={language.key}
            languageCode={language.key}
            index={index}
          />
        ))}
        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
            >
              {isEdit ? "Edit Product Filter" : "Add Product Filter"}
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

export default ProductFilterForm;
