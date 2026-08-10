import { DeleteOutlined } from "@ant-design/icons";
import { Button, message, Modal } from "antd";
import { deleteCustomersService } from "../../../../../service/apiServices/customerServices.ts";

interface DeleteCustomerProps {
  customerId: string;
  customerName?: string;
  onDeleted?: () => void;
}

function DeleteCustomer({
  customerId,
  customerName,
  onDeleted,
}: DeleteCustomerProps) {
  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Customer",
      content: `Are you sure you want to delete "${customerName}"? This action cannot be undone.`,
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okType: "danger",
      centered: true,
      width: 400,
      onOk: async () => {
        await deleteCustomersService(customerId);
        message.success(`"${customerName}" has been deleted successfully`);
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

export default DeleteCustomer;
