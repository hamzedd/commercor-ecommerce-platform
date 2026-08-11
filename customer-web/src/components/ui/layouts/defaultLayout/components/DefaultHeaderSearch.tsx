import React, { useState } from "react";
import SearchProductsForm from "@/src/components/ui/forms/SearchProductsForm";
import { Form } from "antd";
import SearchProductsModal from "@/src/components/ui/modals/searchProductsModal/SearchProductsModal";

function DefaultHeaderSearch() {
  const [show, setShow] = useState(false);
  const [headerForm] = Form.useForm();
  const [modalForm] = Form.useForm();

  const handleSubmit = () => {
    setShow(true);
    modalForm.setFieldsValue(headerForm.getFieldsValue());
  };

  return (
    <>
      <SearchProductsForm
        form={headerForm}
        className={"w-full"}
        onFinish={handleSubmit}
      />
      <SearchProductsModal
        setShow={setShow}
        show={show}
        modalForm={modalForm}
      />
    </>
  );
}

export default DefaultHeaderSearch;
