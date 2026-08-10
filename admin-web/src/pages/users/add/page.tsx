import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Form, message } from "antd";
import UserForm from "../../../components/ui/forms/userForm/UserForm.tsx";
import { addUsersService } from "../../../service/apiServices/usersServices.ts";
import setApiFormErrors from "../../../utils/functions/setApiFormErrors.ts";

function AddUserPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (data: any) => {
    setLoading(true);
    try {
      await addUsersService(data);
      navigate("/admin/users");
      message.success("user added successfully!");
    } catch (error: any) {
      if (error?.response?.data?.errors) {
        setApiFormErrors(error.response.data.errors, form);
      }
      message.error("Failed to add user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/users");
  };

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
          <h1>Create admin user</h1>
          <p>Add credentials and assign an existing administrative role.</p>
        </div>
      </header>
      <section className="management-form-surface">
        <UserForm
          form={form}
          onFinish={onFinish}
          loading={loading}
          onCancel={handleCancel}
        />
      </section>
    </div>
  );
}

export default AddUserPage;
