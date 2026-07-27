import { useState } from "react";
import { Link, useNavigate } from "react-router";
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
    <div className={"flex flex-col gap-5"}>
      <Link to={"/admin/companies"}>
        <Button>Go Back</Button>
      </Link>
      <CompanyDetailForm
        form={form}
        onFinish={onFinish}
        loading={loading}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default AddCompanyPage;
