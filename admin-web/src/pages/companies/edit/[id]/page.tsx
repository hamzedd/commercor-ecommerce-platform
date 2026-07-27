import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Button, Form, message, Spin } from "antd";
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
    <div className={"flex flex-col gap-5"}>
      <Link to={"/admin/companies"}>
        <Button>Go Back</Button>
      </Link>
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
        <Spin spinning />
      )}
    </div>
  );
}

export default EditCompanyPage;
