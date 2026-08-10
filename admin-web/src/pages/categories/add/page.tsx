import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
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
    <div className="management-page management-editor">
      <header className="management-editor__header">
        <Link to="/admin/categories">
          <Button type="text" icon={<ArrowLeftOutlined />}>
            Categories
          </Button>
        </Link>
        <div>
          <span className="management-kicker">Catalog structure</span>
          <h1>Create category</h1>
          <p>Add translated category content, hierarchy, and imagery.</p>
        </div>
      </header>
      <section className="management-form-surface">
        <CategoryForm
          form={form}
          onFinish={onFinish}
          loading={loading}
          onCancel={handleCancel}
        />
      </section>
    </div>
  );
}

export default AddCategoryPage;
