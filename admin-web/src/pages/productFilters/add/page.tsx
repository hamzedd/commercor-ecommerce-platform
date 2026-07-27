import { useState } from "react";
import { Link, useNavigate } from "react-router";
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
    <div className={"flex flex-col gap-5"}>
      <Link to={"/admin/product-filters"}>
        <Button>Go Back</Button>
      </Link>
      <ProductFilterForm
        form={form}
        onFinish={onFinish}
        loading={loading}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default AddProductFilterPage;
