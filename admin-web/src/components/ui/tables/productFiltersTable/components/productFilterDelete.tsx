import { DeleteOutlined } from "@ant-design/icons";
import { Button, message, Modal } from "antd";
import { deleteProductFiltersService } from "../../../../../service/apiServices/productFilterServices.ts";

interface DeleteProductFilterProps {
  productFilterId: string;
  productFilterName?: string;
  onDeleted?: () => void;
}

function DeleteProductFilter({
  productFilterId,
  productFilterName,
  onDeleted,
}: DeleteProductFilterProps) {
  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Product Filter",
      content: `Are you sure you want to delete "${productFilterName}"? This action cannot be undone.`,
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okType: "danger",
      centered: true,
      width: 400,
      onOk: async () => {
        await deleteProductFiltersService(productFilterId);
        message.success(`"${productFilterName}" has been deleted successfully`);
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

export default DeleteProductFilter;
