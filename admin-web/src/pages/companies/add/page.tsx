import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Form, message } from "antd";
import CompanyDetailForm from "../../../components/ui/forms/companyDetailForm/CompanyDetailForm.tsx";
import { createCompanyDetailService } from "../../../service/apiServices/companyServices.ts";

function AddCompanyPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await createCompanyDetailService(values);
      message.success("Company Detail added successfully!");
      navigate("/admin/companies");
    } catch {
      message.error("Failed to add company. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/companies");
  };

  return (
    <div className="management-page management-editor">
      <header className="management-editor__header">
        <Link to="/admin/companies">
          <Button type="text" icon={<ArrowLeftOutlined />}>
            Companies
          </Button>
        </Link>
        <div>
          <span className="management-kicker">Store content</span>
          <h1>Create company detail</h1>
          <p>Add an existing company-detail type with its text or image.</p>
        </div>
      </header>
      <section className="management-form-surface">
        <CompanyDetailForm
          form={form}
          onFinish={onFinish}
          loading={loading}
          onCancel={handleCancel}
        />
      </section>
    </div>
  );
}

export default AddCompanyPage;
