import CustomersTable from "../../components/ui/tables/customersTable/CustomersTable.tsx";
import { PlusOutlined } from "@ant-design/icons";
import { Alert, Button } from "antd";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getCustomersService } from "../../service/apiServices/customerServices.ts";
import type { CustomerType } from "../../utils/types/customerTypes.ts";

function CustomersPage() {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getCustomersService();
      setCustomers(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="management-page management-list-page">
      <header className="management-hero">
        <div>
          <span className="management-kicker">Relationships</span>
          <h1>Customers</h1>
          <p>Manage customer identities and account contact information.</p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/customers/add")}
        >
          Create Customer
        </Button>
      </header>
      {error && (
        <Alert
          type="error"
          showIcon
          message="Customers could not be loaded"
          description="Check your connection and try again."
          action={<Button onClick={() => void fetchCustomers()}>Retry</Button>}
        />
      )}
      <CustomersTable
        data={customers}
        loading={loading}
        fetchData={fetchCustomers}
      />
    </div>
  );
}

export default CustomersPage;
