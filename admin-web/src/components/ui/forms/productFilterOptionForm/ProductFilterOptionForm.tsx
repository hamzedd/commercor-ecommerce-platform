import { Button, Form, type FormProps } from "antd";
import TextInput from "../../inputs/TextInput.tsx";
import EditableLangTabs from "../../tabs/EditableLangTabs.tsx";
import { Fragment, useState } from "react";
import type { FormLanguageType } from "../../../../utils/types/formTypes.ts";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import countriesOptions from "../brandForm/components/countriesOptions.ts";

function ProductFilterOptionForm(props: FormProps) {
  const [activeLangTab, setActiveLangTab] = useState(
    props?.initialValues
      ? props?.initialValues?.translations?.[0]?.lang
      : countriesOptions[0].value,
  );
  const [languages, setLanguages] = useState<FormLanguageType[]>(
    props?.initialValues
      ? props.initialValues?.translations?.map((t: any) => ({
          label: t.lang,
          key: t.lang,
        }))
      : [countriesOptions[0]],
  );
  return (
    <>
      <EditableLangTabs
        languages={languages}
        setLanguages={setLanguages}
        activeKey={activeLangTab}
        setActiveKey={setActiveLangTab}
      />
      <Form {...props}>
        <div className="flex gap-2 w-full">
          {languages?.map((lan, index) => (
            <Fragment key={lan.key}>
              <TextInput
                formProps={{
                  className: "hidden",
                  name: ["translations", index, "lang"],
                  initialValue: lan.key,
                }}
              />
              <TextInput
                formProps={{
                  className: `${lan?.key === activeLangTab ? "block" : "hidden"} grow`,
                  name: ["translations", index, "name"],
                }}
              />
            </Fragment>
          ))}
          <Button type={"primary"} htmlType={"submit"}>
            <EditOutlined />
          </Button>
          <Button htmlType={"reset"}>
            <DeleteOutlined />
          </Button>
        </div>
      </Form>
    </>
  );
}

export default ProductFilterOptionForm;
