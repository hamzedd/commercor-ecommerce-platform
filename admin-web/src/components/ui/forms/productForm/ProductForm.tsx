import { Button, Form, message, Space, type FormProps } from "antd";
import type { ProductType } from "../../../../utils/types/productTypes.ts";
import { useEffect, useState } from "react";
import EditableLangTabs from "../../tabs/EditableLangTabs.tsx";
import ProductTranslationFields from "./components/ProductTranslationFields.tsx";
import type {
  FormLanguageType,
  FormOptionType,
} from "../../../../utils/types/formTypes.ts";
import FileInput from "../../inputs/FileInput.tsx";
import NumberInput from "../../inputs/NumberInput.tsx";
import { getCategoriesService } from "../../../../service/apiServices/categoryServices.ts";
import { getBrandsService } from "../../../../service/apiServices/brandServices.ts";
import NativeSelectInput from "../../inputs/NativeSelectInput.tsx";
import countriesOptions from "../brandForm/components/countriesOptions.ts";

interface Props extends FormProps {
  loading: boolean;
  onCancel: () => void;
  isEdit?: boolean;
}

function ProductForm({
  form,
  onFinish,
  loading,
  isEdit,
  onCancel,
  ...props
}: Props) {
  const [options, setOptions] = useState({
    categories: [] as FormOptionType[],
    brands: [] as FormOptionType[],
  });
  const [activeLangTab, setActiveLangTab] = useState(countriesOptions[0].value);
  const [languages, setLanguages] = useState<FormLanguageType[]>(
    props?.initialValues
      ? props.initialValues?.translations?.map((t: any) => ({
          label: t.lang,
          key: t.lang,
        }))
      : [countriesOptions[0]],
  );

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [categories, brands] = await Promise.all([
          getCategoriesService().then((res) =>
            res.map((category: any) => ({
              label: category.translations?.[0]?.name,
              value: category.id,
            })),
          ),
          getBrandsService().then((res) =>
            res.map((brand: any) => ({
              label: brand.translations?.[0]?.name,
              value: brand.id,
            })),
          ),
        ]);
        setOptions({ categories, brands });
      } catch {
        message.error(
          "Failed to load categories and brands. Please refresh the page.",
        );
      }
    };

    fetchOptions();
  }, []);

  return (
    <>
      <EditableLangTabs
        languages={languages}
        setLanguages={setLanguages}
        activeKey={activeLangTab}
        setActiveKey={setActiveLangTab}
      />
      <Form<ProductType>
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        {...props}
      >
        <NativeSelectInput
          formProps={{
            label: "Category",
            name: "categoryId",
            rules: [{ required: true, message: "Please select Category" }],
          }}
          inputProps={{
            placeholder: "Select Category",
            options: options.categories,
          }}
        />
        <NativeSelectInput
          formProps={{
            label: "Brand",
            name: "brandId",
            rules: [{ required: true, message: "Please select Brand" }],
          }}
          inputProps={{
            placeholder: "Select Brand",
            options: options.brands,
          }}
        />
        <NumberInput
          formProps={{
            label: "Price",
            name: "price",
            rules: [{ required: true, message: "Please enter Price" }],
          }}
          inputProps={{ placeholder: "Enter price" }}
        />
        <NumberInput
          formProps={{
            label: "Stock",
            name: "stock",
            rules: [{ required: true, message: "Please enter Stock" }],
          }}
          inputProps={{ placeholder: "Enter Stock" }}
        />
        {languages?.map((language, index) => (
          <ProductTranslationFields
            className={`${language.key === activeLangTab ? "block" : "hidden"}`}
            key={language.key}
            languageCode={language.key}
            index={index}
          />
        ))}
        <FileInput
          formProps={{
            label: "Product Images",
            name: "images",
          }}
          inputProps={{}}
        />
        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
            >
              {isEdit ? "Edit Product" : "Add Product"}
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

export default ProductForm;
