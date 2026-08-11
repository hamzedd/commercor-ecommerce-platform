import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Form, message, Spin } from "antd";
import type { ProductFilterType } from "../../../utils/types/productFilterTypes.ts";
import {
  getProductFilterService,
  updateProductFilterService,
} from "../../../service/apiServices/productFilterServices.ts";
import ProductFilterForm from "../../ui/forms/productFilterForm/ProductFilterForm.tsx";

interface Props {
  filterId: string;
}

function ProductFilterEditTab({ filterId }: Props) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<ProductFilterType>();

  const onFinish = async () => {
    setLoading(true);
    try {
      if (!filterId) {
        return;
      }
      await updateProductFilterService(
        filterId,
        form.getFieldsValue(true) as ProductFilterType,
      );
      message.success("product Filter updated successfully!");
      navigate("/admin/product-filters");
    } catch {
      message.error("Failed to add product Filter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/product-filters");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!filterId) return;
      const productdata = await getProductFilterService(filterId);
      setInitialValues({
        ...productdata,
        categoryIds:
          productdata.categoryIds ||
          productdata.categories?.map((category) => category.id) ||
          [],
      });
    };
    fetchProduct();
  }, [filterId]);
  return initialValues ? (
    <ProductFilterForm
      form={form}
      isEdit
      onFinish={onFinish}
      loading={loading}
      onCancel={handleCancel}
      initialValues={initialValues}
    />
  ) : (
    <Spin spinning />
  );
}

export default ProductFilterEditTab;
