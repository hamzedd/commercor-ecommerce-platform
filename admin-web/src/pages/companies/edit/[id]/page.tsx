import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Form, message, Skeleton } from "antd";
import CompanyDetailForm from "../../../../components/ui/forms/companyDetailForm/CompanyDetailForm.tsx";
import {
  getCompanyService,
  updateCompanyDetailService,
} from "../../../../service/apiServices/companyServices.ts";
import type { CompanyDetailType } from "../../../../utils/types/companyDetailTypes.ts";

function EditCompanyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<CompanyDetailType>();

  const onFinish = async () => {
    setLoading(true);
    try {
      if (!id) {
        return;
      }
      await updateCompanyDetailService(
        id,
        form.getFieldsValue(true) as CompanyDetailType,
      );
      message.success("Company Detail updated successfully!");
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

  useEffect(() => {
    const fetchCompany = async () => {
      if (!id) return;
      const companyData = await getCompanyService(id);
      setInitialValues(companyData);
    };
    fetchCompany();
  }, [id]);

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
          <h1>Edit company detail</h1>
          <p>Update this existing storefront detail and its image.</p>
        </div>
      </header>
      <section className="management-form-surface">
        {initialValues ? (
          <CompanyDetailForm
            form={form}
            isEdit
            onFinish={onFinish}
            loading={loading}
            onCancel={handleCancel}
            initialValues={initialValues}
          />
        ) : (
          <Skeleton active paragraph={{ rows: 6 }} />
        )}
      </section>
    </div>
  );
}

export default EditCompanyPage;
