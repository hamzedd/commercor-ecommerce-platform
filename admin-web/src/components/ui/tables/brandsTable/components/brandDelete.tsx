import {Button, message, Modal} from 'antd';
import {deleteBrandsService} from "../../../../../service/apiServices/brandServices.ts";

interface DeleteBrandProps {
  brandId: string;
  brandName?: string;
  onDeleted?: () => void;
}
 
function DeleteBrand({brandId, brandName, onDeleted}: DeleteBrandProps) {

  const handleDelete = () => {
    Modal.confirm({
      title: 'Delete Brand',
      content: `Are you sure you want to delete "${brandName}"? This action cannot be undone.`,
      okText: 'Yes, Delete',
      cancelText: 'Cancel',
      okType: 'danger',
      centered: true,
      width: 400,
      onOk: async () => {
        await deleteBrandsService(brandId);
        message.success(`"${brandName}" has been deleted successfully`);
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

export default DeleteBrand;
