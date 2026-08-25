"use client";

import { Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import SearchProductsModal from "@/src/components/ui/modals/searchProductsModal/SearchProductsModal";

function HomeHeroSearch() {
  const t = useTranslations();
  const [show, setShow] = useState(false);
  const [form] = Form.useForm();

  return (
    <>
      <Form form={form} onFinish={() => setShow(true)} className="w-full">
        <Form.Item name="search" noStyle>
          <div className="flex min-h-14 w-full items-center rounded-2xl border border-white/20 bg-white p-1.5 shadow-2xl shadow-black/20 transition focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-300/20 sm:min-h-16">
            <SearchOutlined
              aria-hidden
              className="ml-3 text-lg text-slate-500 sm:ml-4"
            />
            <input
              type="search"
              aria-label={t("searchProducts")}
              placeholder={t("homeSearchPlaceholder")}
              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-950 outline-none placeholder:text-slate-500 sm:text-base"
              onChange={(event) =>
                form.setFieldValue("search", event.target.value)
              }
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-violet-900/20 transition-all duration-200 hover:shadow-md hover:shadow-violet-800/30 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:outline-none sm:px-6"
            >
              {t("search")}
            </button>
          </div>
        </Form.Item>
      </Form>
      <SearchProductsModal show={show} setShow={setShow} modalForm={form} />
    </>
  );
}

export default HomeHeroSearch;
