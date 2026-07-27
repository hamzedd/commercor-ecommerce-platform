import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button, Form, message } from "antd";
import ProductForm from "../../../components/ui/forms/productForm/ProductForm.tsx";
import { createProductsService } from "../../../service/apiServices/productServices.ts";

function AddProductPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (data: any) => {
    setLoading(true);
    try {
      await createProductsService(data);
      navigate("/admin/products");
      message.success("product added successfully!");
    } catch {
      message.error("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/products");
  };

  return (
    <div className={"flex flex-col gap-5"}>
      <Link to={"/admin/products"}>
        <Button>Go Back</Button>
      </Link>
      <ProductForm
        form={form}
        onFinish={onFinish}
        loading={loading}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default AddProductPage;
