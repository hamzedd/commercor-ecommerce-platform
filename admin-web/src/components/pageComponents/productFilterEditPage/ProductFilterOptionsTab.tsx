import { useEffect, useState } from "react";
import { getProductFilterOptionsService } from "../../../service/apiServices/productFilterOptionServices.ts";
import ProductFilterOptionEdit from "./ProductFilterOptionEdit.tsx";
import type { ProductFilterOptionType } from "../../../utils/types/productFilterOptionTypes.ts";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ProductFilterOptionAdd from "./ProductFilterOptionAdd.tsx";

interface Props {
  filterId: string;
}
function ProductFilterOptionsTab({ filterId }: Props) {
  const [options, setOptions] = useState<ProductFilterOptionType[]>([]);
  const [newOptions, setNewOptions] = useState<number[]>([]);

  const fetchData = async () => {
    const data = await getProductFilterOptionsService(filterId);
    setOptions(data);
  };

  useEffect(() => {
    fetchData();
  }, [filterId]);

  const handleAdd = () => {
    setNewOptions((prev) => {
      const newId = Math.random();
      if (prev.includes(newId)) {
        return prev;
      }
      return [...prev, newId];
    });
  };

  return (
    <div>
      {options?.map((option) => (
        <ProductFilterOptionEdit
          key={option.id}
          data={option}
          setOptions={setOptions}
        ></ProductFilterOptionEdit>
      ))}
      {newOptions?.map((id) => (
        <ProductFilterOptionAdd
          key={id}
          optionTempId={id}
          filterId={filterId}
          setOptions={setNewOptions}
          fetchData={fetchData}
        />
      ))}
      <Button
        onClick={handleAdd}
        type="dashed"
        style={{ width: "100%" }}
        icon={<PlusOutlined />}
      >
        Add Product Filter Option
      </Button>
    </div>
  );
}

export default ProductFilterOptionsTab;
