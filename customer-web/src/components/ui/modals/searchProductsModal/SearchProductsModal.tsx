import React from "react";
import DefaultModal from "@/src/components/ui/modals/defaultModal/DefaultModal";
import { FormInstance } from "antd";
import SearchProductsForm from "@/src/components/ui/forms/SearchProductsForm";
import SearchedProductsList from "@/src/components/ui/modals/searchProductsModal/components/SearchedProductsList";
import { useTranslations } from "next-intl";

interface Props {
  show: boolean;
  setShow: (visible: boolean) => void;
  modalForm: FormInstance;
}

function SearchProductsModal({ show, setShow, modalForm }: Props) {
  const t = useTranslations();

  return (
    <DefaultModal
      title={t("searchProducts")}
      onClose={() => setShow(false)}
      show={show}
    >
      <div className="flex w-full flex-col gap-4">
        <SearchProductsForm className={"w-full"} form={modalForm} />
        <SearchedProductsList form={modalForm} setShow={setShow} />
      </div>
    </DefaultModal>
  );
}

export default SearchProductsModal;
