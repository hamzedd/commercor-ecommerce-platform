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
        <Button
          htmlType={"submit"}
          block
          className="!h-11 !rounded-xl !border-0 !bg-gradient-to-r !from-blue-600 !via-violet-600 !to-pink-600 !font-bold !text-white !shadow-md !shadow-violet-900/20 transition-transform duration-200 hover:!scale-[1.02] focus-visible:!ring-2 focus-visible:!ring-violet-500 focus-visible:!ring-offset-2"
        >
          {t("save")}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default AddressForm;
