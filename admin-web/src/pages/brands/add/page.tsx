import { useState } from "react";
import { Link, useNavigate } from "react-router";
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
    <div className={"flex flex-col gap-5"}>
      <Link to={"/admin/brands"}>
        <Button>Go Back</Button>
      </Link>
      <BrandForm
        form={form}
        onFinish={onFinish}
        loading={loading}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default AddBrandPage;
