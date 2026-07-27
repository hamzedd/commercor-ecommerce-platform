import { useNavigate } from "react-router";
import { Form, message, Spin } from "antd";
import { useEffect, useState } from "react";
import type { ProductType } from "../../../utils/types/productTypes.ts";
import {
  getProductService,
  updateProductService,
} from "../../../service/apiServices/productServices.ts";
import ProductForm from "../../ui/forms/productForm/ProductForm.tsx";

interface Props {
  productId: string;
}

function EditProductPageProductTab({ productId }: Props) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<ProductType>();

  const onFinish = async () => {
    setLoading(true);
    try {
      if (!productId) {
        return;
      }
      await updateProductService(
        productId,
        form.getFieldsValue(true) as ProductType,
      );
      message.success("product updated successfully!");
      navigate("/admin/products");
    } catch {
      message.error("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/products");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      const productData = await getProductService(productId);
      setInitialValues(productData);
    };
    fetchProduct();
  }, [productId]);

  return initialValues ? (
    <ProductForm
      isEdit
      form={form}
      onFinish={onFinish}
      loading={loading}
      onCancel={handleCancel}
      initialValues={initialValues}
    />
  ) : (
    <Spin spinning />
  );
}

export default EditProductPageProductTab;
