import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Form, message, Skeleton } from "antd";
import CategoryForm from "../../../../components/ui/forms/categoryForm/CategoryForm";
import {
  getCategoryService,
  updateCategoryService,
} from "../../../../service/apiServices/categoryServices.ts";
import type { CategoryType } from "../../../../utils/types/categoryTypes.ts";

function EditCategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<CategoryType>();

  const onFinish = async () => {
    setLoading(true);
    try {
      if (!id) {
        return;
      }
      await updateCategoryService(
        id,
        form.getFieldsValue(true) as CategoryType,
      );
      message.success("Category updated successfully!");
      navigate("/admin/categories");
    } catch {
      message.error("Failed to add category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/categories");
  };

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return;
      const categoryData = await getCategoryService(id);
      setInitialValues(categoryData);
    };
    fetchCategory();
  }, [id]);

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
          <h1>Edit category</h1>
          <p>Update hierarchy, translations, and category imagery.</p>
        </div>
      </header>
      <section className="management-form-surface">
        {initialValues ? (
          <CategoryForm
            form={form}
            isEdit
            onFinish={onFinish}
            loading={loading}
            onCancel={handleCancel}
            initialValues={initialValues}
          />
        ) : (
          <Skeleton active paragraph={{ rows: 8 }} />
        )}
      </section>
    </div>
  );
}

export default EditCategoryPage;
