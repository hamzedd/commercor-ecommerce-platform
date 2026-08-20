import { Form, FormProps } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

function SearchProductsForm(props: FormProps) {
  const t = useTranslations();
  const search = Form.useWatch("search", props.form);

  return (
    <Form {...props}>
      <Form.Item noStyle={true} name={"search"}>
        <div className="relative flex h-11 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition-all focus-within:border-gray-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--store-accent)]/20 md:h-12">
          <input
            value={search}
            onChange={(e) => {
              props.form?.setFieldsValue({ search: e.target.value });
            }}
            type="text"
            className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none md:px-5"
            placeholder={t("searchPlaceholder")}
          />
          <button
            type="submit"
            aria-label={t("search")}
            className="flex items-center gap-2 bg-[var(--store-primary)] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 md:px-5"
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
