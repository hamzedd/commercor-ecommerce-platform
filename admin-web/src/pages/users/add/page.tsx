import { useState } from "react";
import { Link, useNavigate } from "react-router";
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
    <div className={"flex flex-col gap-5"}>
      <Link to={"/admin/users"}>
        <Button>Go Back</Button>
      </Link>
      <UserForm
        form={form}
        onFinish={onFinish}
        loading={loading}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default AddUserPage;
