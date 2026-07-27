import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Button, Form, message, Spin } from "antd";
import CustomerForm from "../../../../components/ui/forms/customerForm/CustomerForm";
import {
  getCustomerService,
  updateCustomerService,
} from "../../../../service/apiServices/customerServices.ts";
import type { CustomerType } from "../../../../utils/types/customerTypes.ts";

function EditCustomerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<CustomerType>();

  const onFinish = async () => {
    setLoading(true);
    try {
      if (!id) {
        return;
      }
      await updateCustomerService(
        id,
        form.getFieldsValue(true) as CustomerType,
      );
      message.success("Customer updated successfully!");
      navigate("/admin/customers");
    } catch {
      message.error("Failed to add customer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/customers");
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) return;
      const customerData = await getCustomerService(id);
      setInitialValues(customerData);
    };
    fetchCustomer();
  }, [id]);

  return (
    <div className={"flex flex-col gap-5"}>
      <Link to={"/admin/customers"}>
        <Button>Go Back</Button>
      </Link>
      {initialValues ? (
        <CustomerForm
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

export default EditCustomerPage;
