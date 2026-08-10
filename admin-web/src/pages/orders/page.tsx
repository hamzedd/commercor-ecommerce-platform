import OrdersTable from "../../components/ui/tables/ordersTable/OrdersTable.tsx";
import { Alert, Button } from "antd";
import { useEffect, useState } from "react";
import { getOrdersService } from "../../service/apiServices/orderServices.ts";
import type { OrderType } from "../../utils/types/orderTypes.ts";

function OrdersPage() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [error, setError] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getOrdersService();
      setOrders(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="management-page management-list-page">
      <header className="management-hero">
        <div>
          <span className="management-kicker">Operations</span>
          <h1>Orders</h1>
          <p>
            Review customer orders, totals, status, and fulfillment details.
          </p>
        </div>
      </header>
      {error && (
        <Alert
          type="error"
          showIcon
          message="Orders could not be loaded"
          description="Check your connection and try again."
          action={<Button onClick={() => void fetchOrders()}>Retry</Button>}
        />
      )}
      <OrdersTable data={orders} loading={loading} fetchData={fetchOrders} />
    </div>
  );
}

export default OrdersPage;
