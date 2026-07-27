import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Button, Form, message, Spin } from "antd";
import BrandForm from "../../../../components/ui/forms/brandForm/BrandForm";
import {
  getBrandService,
  updateBrandService,
} from "../../../../service/apiServices/brandServices.ts";
import type { BrandType } from "../../../../utils/types/brandTypes.ts";

function EditBrandPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<BrandType>();

  const onFinish = async () => {
    setLoading(true);
    try {
      if (!id) {
        return;
      }
      await updateBrandService(id, form.getFieldsValue(true) as BrandType);
      message.success("Brand updated successfully!");
      navigate("/admin/brands");
    } catch {
      message.error("Failed to add brand. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/brands");
  };

  useEffect(() => {
    const fetchBrand = async () => {
      if (!id) return;
      const brandData = await getBrandService(id);
      setInitialValues(brandData);
    };
    fetchBrand();
  }, [id]);

  return (
    <div className={"flex flex-col gap-5"}>
      <Link to={"/admin/brands"}>
        <Button>Go Back</Button>
      </Link>
      {initialValues ? (
        <BrandForm
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

export default EditBrandPage;
