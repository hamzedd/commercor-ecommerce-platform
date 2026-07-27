import React, { useState } from "react";
import { Button, Select, Space, Tabs } from "antd";
import countriesOptions from "../forms/brandForm/components/countriesOptions.ts";

interface Props {
  activeKey: string;
  setActiveKey: (key: string) => void;
  languages: {
    label: string;
    key: string;
  }[];
  setLanguages: (languages: { label: string; key: string }[]) => void;
}

function EditableLangTabs({
  languages,
  setLanguages,
  activeKey,
  setActiveKey,
}: Props) {
  const [chosenCountry, setChosenCountry] = useState<string | null>(
    countriesOptions[0].value,
  );

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = (name: string) => {
    const newPanes = [...languages];
    newPanes.push({
      label: name,
      key: name,
    });
    setLanguages(newPanes);
    setActiveKey(name);
    setChosenCountry(null);
  };

  const remove = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
  ) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    languages.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = languages.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setLanguages(newPanes);
    setActiveKey(newActiveKey);
  };

  return (
    <Tabs
      type="editable-card"
      onChange={onChange}
      activeKey={activeKey}
      onEdit={remove}
      items={languages}
      hideAdd
      tabBarExtraContent={{
        right: (
          <Space>
            <Select
              options={countriesOptions?.filter(
                (option) =>
                  !languages.find((item) => item.key === option.value),
              )}
              value={chosenCountry}
              style={{ minWidth: 100 }}
              dropdownMatchSelectWidth={false}
              onChange={setChosenCountry}
              showSearch
            />
            <Button
              onClick={() => chosenCountry && add(chosenCountry)}
              disabled={
                !chosenCountry ||
                !!languages?.find((option) => chosenCountry === option.key)
              }
              type="dashed"
            >
              Add Language
            </Button>
          </Space>
        ),
      }}
    />
  );
}

export default EditableLangTabs;
