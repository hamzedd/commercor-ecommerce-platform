import { Button, Form, FormProps } from "antd";
import React from "react";
import TextInput from "@/src/components/ui/inputs/TextInput";
import { useTranslations } from "next-intl";

function AddressForm(props: FormProps) {
  const t = useTranslations();

  return (
    <Form {...props}>
      <TextInput
        formProps={{ name: "country", label: t("country") }}
        inputProps={{ placeholder: t("enterCountry") }}
      />
      <TextInput
        formProps={{ name: "city", label: t("city") }}
        inputProps={{ placeholder: t("enterCity") }}
      />
      <TextInput
        formProps={{ name: "street", label: t("street") }}
        inputProps={{ placeholder: t("enterStreet") }}
      />
      <TextInput
        formProps={{ name: "detail", label: t("details") }}
        inputProps={{ placeholder: t("enterDetails") }}
      />
      <TextInput
        formProps={{ name: "phoneNumber", label: t("phoneNumber") }}
        inputProps={{ placeholder: t("enterPhoneNumber") }}
      />
      <Form.Item>
        <Button htmlType={"submit"}>{t("save")}</Button>
      </Form.Item>
    </Form>
  );
}

export default AddressForm;
