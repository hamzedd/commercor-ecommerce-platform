import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button, Form, message } from "antd";
import CategoryForm from "../../../components/ui/forms/categoryForm/CategoryForm.tsx";
import { createCategoriesService } from "../../../service/apiServices/categoryServices.ts";
import setApiFormErrors from "../../../utils/functions/setApiFormErrors.ts";

function AddCategoryPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (data: any) => {
    setLoading(true);
    try {
      await createCategoriesService(data);
      navigate("/admin/categories");
      message.success("Category added successfully!");
    } catch (error: any) {
      if (error?.response?.data?.errors) {
        setApiFormErrors(error.response.data.errors, form);
      }
      message.error("Failed to add category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/categories");
  };

  return (
    <div className={"flex flex-col gap-5"}>
      <Link to={"/admin/categories"}>
        <Button>Go Back</Button>
      </Link>
      <CategoryForm
        form={form}
        onFinish={onFinish}
        loading={loading}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default AddCategoryPage;
