import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Form, message } from "antd";
import ProductFilterForm from "../../../components/ui/forms/productFilterForm/ProductFilterForm.tsx";
import { createProductFiltersService } from "../../../service/apiServices/productFilterServices.ts";

function AddProductFilterPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (data: any) => {
    setLoading(true);
    try {
      await createProductFiltersService(data);
      navigate("/admin/product-filters");
      message.success("product Filter added successfully!");
    } catch {
      message.error("Failed to add product Filter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/product-filters");
  };

  return (
    <div className="management-page management-editor">
      <header className="management-editor__header">
        <Link to="/admin/product-filters">
          <Button type="text" icon={<ArrowLeftOutlined />}>
            Product Filters
          </Button>
        </Link>
        <div>
          <span className="management-kicker">Catalog attributes</span>
          <h1>Create product filter</h1>
          <p>
            Choose an existing filter type and add translated filter content.
          </p>
        </div>
      </header>
      <section className="management-form-surface">
        <ProductFilterForm
          form={form}
          onFinish={onFinish}
          loading={loading}
          onCancel={handleCancel}
        />
      </section>
    </div>
  );
}

export default AddProductFilterPage;
