import CustomersTable from "../../components/ui/tables/customersTable/CustomersTable.tsx";
import { Button, Space } from "antd";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getCustomersService } from "../../service/apiServices/customerServices.ts";
import type { CustomerType } from "../../utils/types/customerTypes.ts";

function CustomersPage() {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomersService();
      setCustomers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <Space direction={"vertical"} className={"w-full"}>
      <Button type="primary" onClick={() => navigate("/admin/customers/add")}>
        Add customer
      </Button>
      <CustomersTable
        data={customers}
        loading={loading}
        fetchData={fetchCustomers}
      />
    </Space>
  );
}

export default CustomersPage;
