import { Form, FormProps } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

function SearchProductsForm(props: FormProps) {
  const t = useTranslations();
  const search = Form.useWatch("search", props.form);

  return (
    <Form {...props}>
      <Form.Item noStyle={true} name={"search"}>
        <div className="focus-within:ring-opacity-20 relative flex h-10 w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm transition-all focus-within:border-black focus-within:ring-2 focus-within:ring-black md:h-11">
          <input
            value={search}
            onChange={(e) => {
              props.form?.setFieldsValue({ search: e.target.value });
            }}
            type="text"
            className="h-full flex-1 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none md:px-5 md:text-base"
            placeholder={t("searchPlaceholder")}
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-gray-800 md:px-6 md:text-base"
          >
            <SearchOutlined className="text-base md:text-lg" />
            <span className="hidden sm:inline">{t("search")}</span>
          </button>
        </div>
      </Form.Item>
    </Form>
  );
}

export default SearchProductsForm;
