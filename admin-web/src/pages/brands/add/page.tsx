import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Form, message } from "antd";
import BrandForm from "../../../components/ui/forms/brandForm/BrandForm.tsx";
import { createBrandsService } from "../../../service/apiServices/brandServices.ts";

function AddBrandPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (data: any) => {
    setLoading(true);
    try {
      await createBrandsService(data);
      navigate("/admin/brands");
      message.success("Brand added successfully!");
    } catch {
      message.error("Failed to add brand. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/brands");
  };

  return (
    <div className="management-page management-editor">
      <header className="management-editor__header">
        <Link to="/admin/brands">
          <Button type="text" icon={<ArrowLeftOutlined />}>
            Brands
          </Button>
        </Link>
        <div>
          <span className="management-kicker">Catalog identity</span>
          <h1>Create brand</h1>
          <p>Add ranking, translated content, and brand imagery.</p>
        </div>
      </header>
      <section className="management-form-surface">
        <BrandForm
          form={form}
          onFinish={onFinish}
          loading={loading}
          onCancel={handleCancel}
        />
      </section>
    </div>
  );
}

export default AddBrandPage;
