import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Form, message, Skeleton } from "antd";
import UserForm from "../../../../components/ui/forms/userForm/UserForm";
import {
  getUserService,
  editUserService,
} from "../../../../service/apiServices/usersServices.ts";
import type { UserType } from "../../../../utils/types/userTypes.ts";

function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<UserType>();

  const onFinish = async () => {
    setLoading(true);
    try {
      if (!id) {
        return;
      }
      await editUserService(id, form.getFieldsValue());
      message.success("User updated successfully!");
      navigate("/admin/users");
    } catch {
      message.error("Failed to add user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/users");
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      const userData = await getUserService(id);
      setInitialValues(userData);
    };
    fetchUser();
  }, [id]);

  return (
    <div className="management-page management-editor">
      <header className="management-editor__header">
        <Link to="/admin/users">
          <Button type="text" icon={<ArrowLeftOutlined />}>
            Admin users
          </Button>
        </Link>
        <div>
          <span className="management-kicker">Access control</span>
          <h1>Edit admin user</h1>
          <p>
            Update account credentials and the assigned administrative role.
          </p>
        </div>
      </header>
      <section className="management-form-surface">
        {initialValues ? (
          <UserForm
            form={form}
            isEdit
            onFinish={onFinish}
            loading={loading}
            onCancel={handleCancel}
            initialValues={initialValues}
          />
        ) : (
          <Skeleton active paragraph={{ rows: 5 }} />
        )}
      </section>
    </div>
  );
}

export default EditUserPage;
