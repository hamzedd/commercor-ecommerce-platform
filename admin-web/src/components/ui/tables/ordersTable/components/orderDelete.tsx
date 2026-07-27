import { Button, message, Modal } from "antd";

interface DeleteOrderProps {
  orderId: string | number;
  orderName?: string;
  onDeleted?: () => void;
}

function DeleteOrder({ orderName, onDeleted }: DeleteOrderProps) {
  const handleDelete = () => {
    const displayName = orderName || "this order";

    Modal.confirm({
      title: "Delete Order",
      content: `Are you sure you want to delete "${displayName}"? This action cannot be undone.`,
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okType: "danger",
      centered: true,
      width: 400,
      onOk() {
        try {
          message.success(`"${displayName}" has been deleted successfully`);
          onDeleted?.(); // Callback after successful deletion
        } catch {
          message.error("Failed to delete order. Please try again.");
        }
      },
    });
  };

  return (
    <Button
      type="link"
      danger
      onClick={(e) => {
        console.log("Button clicked!", e);
        handleDelete();
      }}
      style={{ padding: "4px 8px", cursor: "pointer" }}
    >
      Delete
    </Button>
  );
}

export default DeleteOrder;
