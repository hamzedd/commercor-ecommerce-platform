import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button, Form, message } from "antd";
import CustomerForm from "../../../components/ui/forms/customerForm/CustomerForm.tsx";
import { createCustomerService } from "../../../service/apiServices/customerServices.ts";

function AddCustomerPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (data: any) => {
    setLoading(true);
    try {
      await createCustomerService(data);
      navigate("/admin/customers");
      message.success("Customer added successfully!");
    } catch {
      message.error("Failed to add customer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/customers");
  };

  return (
    <div className={"flex flex-col gap-5"}>
      <Link to={"/admin/customers"}>
        <Button>Go Back</Button>
      </Link>
      <CustomerForm
        form={form}
        onFinish={onFinish}
        loading={loading}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default AddCustomerPage;
