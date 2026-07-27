import {Button, message, Modal} from 'antd';
import {deleteProductsService} from "../../../../../service/apiServices/productServices.ts";

interface DeleteProductProps {
  productId: string;
  productName?: string;
  onDeleted?: () => void;
}

function DeleteProduct({productId, productName, onDeleted}: DeleteProductProps) {

  const handleDelete = () => {
    Modal.confirm({
      title: 'Delete Product',
      content: `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
      okText: 'Yes, Delete',
      cancelText: 'Cancel',
      okType: 'danger',
      centered: true,
      width: 400,
      onOk: async () => {
        await deleteProductsService(productId);
        message.success(`"${productName}" has been deleted successfully`);
        onDeleted?.(); // Callback after successful deletion
      },
    });
  };

  return (
    <Button
      type="link"
      danger
      onClick={() => {
        handleDelete();
      }}
      style={{padding: '4px 8px', cursor: 'pointer'}}
    >
      Delete
    </Button>
  );
}

export default DeleteProduct;
