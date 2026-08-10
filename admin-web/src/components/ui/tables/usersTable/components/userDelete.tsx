import { DeleteOutlined } from "@ant-design/icons";
import { Button, message, Modal } from "antd";
import { deleteUserService } from "../../../../../service/apiServices/usersServices.ts";

interface DeleteUserProps {
  userId: string;
  userName: string;
  onDeleted?: () => void;
}

function DeleteUser({ userId, userName, onDeleted }: DeleteUserProps) {
  const handleDelete = () => {
    Modal.confirm({
      title: "Delete User",
      content: `Are you sure you want to delete "${userName}"? This action cannot be undone.`,
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okType: "danger",
      centered: true,
      width: 400,
      onOk: async () => {
        await deleteUserService(userId);
        message.success(`"${userName}" has been deleted successfully`);
        onDeleted?.();
      },
    });
  };

  return (
    <Button
      type="text"
      danger
      icon={<DeleteOutlined />}
      onClick={() => {
        handleDelete();
      }}
    >
      Delete
    </Button>
  );
}

export default DeleteUser;
