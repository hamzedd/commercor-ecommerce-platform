import { Button, Form, Space, type FormProps } from "antd";
import type { CategoryType } from "../../../../utils/types/categoryTypes.ts";
import { useEffect, useState } from "react";
import { getCategoriesService } from "../../../../service/apiServices/categoryServices.ts";
import NativeSelectInput from "../../inputs/NativeSelectInput.tsx";
import EditableLangTabs from "../../tabs/EditableLangTabs.tsx";
import CategoryTranslationFields from "./components/CategoryTranslationFields.tsx";
import type {
  FormLanguageType,
  FormOptionType,
} from "../../../../utils/types/formTypes.ts";
import FileInput from "../../inputs/FileInput.tsx";
import countriesOptions from "../brandForm/components/countriesOptions.ts";

interface Props extends FormProps {
  loading: boolean;
  onCancel: () => void;
  isEdit?: boolean;
}

function CategoryForm({
  form,
  onFinish,
  loading,
  isEdit,
  onCancel,
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
  const [categories, setCategories] = useState<FormOptionType[]>();

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategoriesService();
      setCategories(
        res.map((category) => ({
          label:
            (
              category.translations.find(
                (t) => t.lang.toLowerCase() === "en",
              ) || category.translations[0]
            )?.name ?? "Untitled",
          value: category.id,
        })),
      );
    };
    fetchCategories();
  }, []);

  return (
    <>
      <EditableLangTabs
        languages={languages}
        setLanguages={setLanguages}
        activeKey={activeLangTab}
        setActiveKey={setActiveLangTab}
      />
      <Form<CategoryType>
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        {...props}
      >
        <NativeSelectInput
          inputProps={{
            options: categories,
            placeholder: "Select Parent Category",
            allowClear: true,
          }}
          formProps={{
            label: "Parent Category",
            name: "parentId",
          }}
        />

        {languages?.map((language, index) => (
          <CategoryTranslationFields
            className={`${language.key === activeLangTab ? "block" : "hidden"}`}
            key={language.key}
            languageCode={language.key}
            index={index}
          />
        ))}

        <FileInput
          formProps={{
            label: "Category Image",
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
              {isEdit ? "Edit Category" : "Add Category"}
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

export default CategoryForm;
