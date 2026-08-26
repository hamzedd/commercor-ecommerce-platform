import { Form, FormProps } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

function SearchProductsForm(props: FormProps) {
  const t = useTranslations();
  const search = Form.useWatch("search", props.form);

  return (
    <Form {...props}>
      <Form.Item noStyle={true} name={"search"}>
        <div className="relative flex h-11 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-all duration-200 focus-within:border-violet-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-500/20 md:h-12">
          <input
            value={search}
            onChange={(e) => {
              props.form?.setFieldsValue({ search: e.target.value });
            }}
            type="text"
            className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none md:px-5"
            placeholder={t("searchPlaceholder")}
          />
          <button
            type="submit"
            aria-label={t("search")}
            className="btn-press flex items-center gap-2 bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 px-4 text-sm font-semibold text-white transition-all duration-200 hover:shadow-md hover:shadow-violet-900/20 md:px-5"
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
