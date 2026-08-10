import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
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
    <div className="management-page management-editor">
      <header className="management-editor__header">
        <Link to="/admin/products">
          <Button type="text" icon={<ArrowLeftOutlined />}>
            Products
          </Button>
        </Link>
        <div>
          <span className="management-kicker">Catalog</span>
          <h1>Create product</h1>
          <p>Add product details, translations, pricing, stock, and imagery.</p>
        </div>
      </header>
      <section className="management-form-surface">
        <ProductForm
          form={form}
          onFinish={onFinish}
          loading={loading}
          onCancel={handleCancel}
        />
      </section>
    </div>
  );
}

export default AddProductPage;
