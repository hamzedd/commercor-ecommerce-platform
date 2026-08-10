import { DeleteOutlined } from "@ant-design/icons";
import { Button, message, Modal } from "antd";
import { deleteCategoriesService } from "../../../../../service/apiServices/categoryServices.ts";

interface DeleteCategoryProps {
  categoryId: string;
  categoryName?: string;
  onDeleted?: () => void;
}

function DeleteCategory({
  categoryId,
  categoryName,
  onDeleted,
}: DeleteCategoryProps) {
  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Category",
      content: `Are you sure you want to delete "${categoryName}"? This action cannot be undone.`,
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okType: "danger",
      centered: true,
      width: 400,
      onOk: async () => {
        await deleteCategoriesService(categoryId);
        message.success(`"${categoryName}" has been deleted successfully`);
        onDeleted?.(); // Callback after successful deletion
      },
    });
  };

  return (
    <Button
      type="text"
      icon={<DeleteOutlined />}
      danger
      onClick={() => {
        handleDelete();
      }}
    >
      Delete
    </Button>
  );
}

export default DeleteCategory;
