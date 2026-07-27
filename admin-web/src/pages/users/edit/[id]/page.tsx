import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Button, Form, message, Spin } from "antd";
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
    <div className={"flex flex-col gap-5"}>
      <Link to={"/admin/users"}>
        <Button>Go Back</Button>
      </Link>
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
        <Spin spinning />
      )}
    </div>
  );
}

export default EditUserPage;
