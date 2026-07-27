import { Form, message } from "antd";
import ProductFilterOptionForm from "../../ui/forms/productFilterOptionForm/ProductFilterOptionForm.tsx";
import { useState } from "react";
import { addProductFilterOptionService } from "../../../service/apiServices/productFilterOptionServices.ts";

interface Props {
  setOptions: React.Dispatch<React.SetStateAction<number[]>>;
  filterId: string;
  optionTempId: number;
  fetchData: () => Promise<void>;
}
function ProductFilterOptionsAdd({
  setOptions,
  filterId,
  optionTempId,
  fetchData,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      await addProductFilterOptionService({
        ...values,
        productFilterId: filterId,
      });
      message.success("Filter Option Successfully Added");
      setOptions((prev) => prev?.filter((item) => item !== optionTempId));
      await fetchData();
    } catch {
      message.error("Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      setOptions((prev) => prev?.filter((item) => item !== optionTempId));
    } catch {
      message.error("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductFilterOptionForm
      className={"w-full"}
      form={form}
      onFinish={handleFinish}
      onReset={handleDelete}
      disabled={loading}
    ></ProductFilterOptionForm>
  );
}

export default ProductFilterOptionsAdd;
