import OrdersTable from "../../components/ui/tables/ordersTable/OrdersTable.tsx";
import { Space} from "antd";
import {useEffect, useState} from "react";
import {getOrdersService} from "../../service/apiServices/orderServices.ts";
import type {OrderType} from "../../utils/types/orderTypes.ts";

function OrdersPage() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderType[]>([]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrdersService();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders()
  },[])


  return (
    <Space direction={'vertical'} className={'w-full'}>
      <OrdersTable data={orders} loading={loading} fetchData={fetchOrders} />
    </Space>
  );
}

export default OrdersPage;
