import ProductFilterValueForm from "../../ui/forms/productFilterValueForm/ProductFilterValueForm.tsx";
import { Form } from "antd";
import type { ProductFilterValueType } from "../../../utils/types/productFilterValueTypes.ts";
import type { FormOptionType } from "../../../utils/types/formTypes.ts";
import { useEffect, useState } from "react";
import {
  assignProductFilterValueService,
  deleteProductFilterValueService,
} from "../../../service/apiServices/productServices.ts";

interface Props {
  productId: string;
  filterValue: ProductFilterValueType;
  filterOptions: { id: string; title: string; options: FormOptionType[] };
  fetchValues: () => Promise<void>;
}

function EditProductPageFilter({
  filterValue,
  filterOptions,
  productId,
  fetchValues,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const handleFinish = async (values: any) => {
    try {
      setLoading(true);
      await assignProductFilterValueService({
        productFilterOptionId: values.filterOptionId,
        productFilterId: filterOptions.id,
        productId,
      });
      await fetchValues();
    } catch {
      if (filterValue?.id) {
        form.setFieldValue("filterId", filterValue?.productFilterOptionId);
      } else {
        form.resetFields();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      if (filterValue?.id) {
        await deleteProductFilterValueService(filterValue.id);
        await fetchValues();
      }
    } catch {
      form.setFieldValue("filterId", filterValue?.productFilterOptionId);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filterValue?.productFilterOptionId) {
      form.setFieldValue("filterOptionId", filterValue?.productFilterOptionId);
    } else {
      form.resetFields();
    }
  }, [filterValue?.productFilterOptionId]);

  return (
    <ProductFilterValueForm
      filterOptions={filterOptions}
      onReset={handleReset}
      disabled={loading}
      onFinish={handleFinish}
      form={form}
    />
  );
}

export default EditProductPageFilter;
