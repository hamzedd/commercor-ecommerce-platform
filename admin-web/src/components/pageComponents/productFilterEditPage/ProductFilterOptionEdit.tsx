import { Form, message } from "antd";
import ProductFilterOptionForm from "../../ui/forms/productFilterOptionForm/ProductFilterOptionForm.tsx";
import type { ProductFilterOptionType } from "../../../utils/types/productFilterOptionTypes.ts";
import { useEffect, useState } from "react";
import {
  deleteProductFilterOptionService,
  editProductFilterOptionService,
} from "../../../service/apiServices/productFilterOptionServices.ts";

interface Props {
  data: ProductFilterOptionType;
  setOptions: React.Dispatch<React.SetStateAction<ProductFilterOptionType[]>>;
}
function ProductFilterOptionsTab({ data, setOptions }: Props) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (data?.id) {
      form.setFieldsValue(data);
    }
  }, [data?.id]);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      await editProductFilterOptionService(data.id, {
        ...values,
        productFilterId: data?.productFilterId,
      });
      message.success("Filter Option Successfully Updated");
    } catch {
      message.error("Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteProductFilterOptionService(data.id);
      setOptions((prev) => prev?.filter((item) => item.id !== data?.id));
      message.success("Filter Option Successfully Deleted");
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
      initialValues={data}
      onFinish={handleFinish}
      onReset={handleDelete}
      disabled={loading}
    ></ProductFilterOptionForm>
  );
}

export default ProductFilterOptionsTab;
