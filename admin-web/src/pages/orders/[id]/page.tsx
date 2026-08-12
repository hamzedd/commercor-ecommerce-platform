import { Link, useParams } from "react-router";
import { Card, Descriptions, Table, Tag, Space, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type {
  OrderItemType,
  OrderType,
} from "../../../utils/types/orderTypes.ts";
import { useEffect, useState } from "react";
import { getOrderService } from "../../../service/apiServices/orderServices.ts";
import type { ProductType } from "../../../utils/types/productTypes.ts";

const { Title, Text } = Typography;

function OrderPage() {
  const { id } = useParams();

  const [orderData, setOrderData] = useState<OrderType>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (id) {
          const res = await getOrderService(id);
          setOrderData(res);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Table columns for order items
  const orderItemColumns: ColumnsType<OrderItemType> = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (product: ProductType) => {
        const translation =
          product?.translations?.find(
            (item) => item?.lang?.toLowerCase() === "en",
          ) || product?.translations?.[0];
        return (
          <Link to={`/admin/products/edit/${product.id}`}>
            {translation?.name}
          </Link>
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => record.quantity * record.unitPrice,
    },
  ];

  // Payment status color mapping
  const getPaymentStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      paid: "success",
      pending: "warning",
      failed: "error",
      refunded: "default",
    };
    return statusColors[status.toLowerCase()] || "default";
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!orderData) {
    return <div>No order data</div>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Order Details #{id}</Title>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Order Summary */}
        <Card title="Order Information" bordered={false}>
          <Descriptions column={{ xs: 1, sm: 2, md: 3 }}>
            <Descriptions.Item label="Order ID">
              {orderData.id}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {orderData.created_at}
            </Descriptions.Item>
            <Descriptions.Item label="Product Amount">
              {orderData.productAmount.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Delivery Amount">
              {orderData.deliveryAmount.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Tax Amount">
              {(orderData.taxAmount || 0).toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount">
              <Text strong>
                {(
                  orderData.finalTotal ??
                  orderData.productAmount +
                    orderData.deliveryAmount +
                    (orderData.taxAmount || 0)
                ).toFixed(2)}
              </Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Customer Information */}
        <Card title="Customer Information" bordered={false}>
          <Descriptions column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="Name">
              {orderData.customer.firstName} {orderData.customer.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {orderData.customer.email}
            </Descriptions.Item>
            <Descriptions.Item label="Username">
              {orderData.customer.username}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Delivery Address */}
        <Card title="Delivery Address" bordered={false}>
          <Descriptions column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="Country">
              {orderData.address.country}
            </Descriptions.Item>
            <Descriptions.Item label="City">
              {orderData.address.city}
            </Descriptions.Item>
            <Descriptions.Item label="Street">
              {orderData.address.street}
            </Descriptions.Item>
            <Descriptions.Item label="Details">
              {orderData.address.detail}
            </Descriptions.Item>
            <Descriptions.Item label="Contact Phone">
              {orderData.address.phoneNumber}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Payment Information */}
        <Card title="Payment Information" bordered={false}>
          <Descriptions column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="Payment ID">
              {orderData.payment.id}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getPaymentStatusColor(orderData.payment.status)}>
                {orderData.payment.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Expected Amount">
              {orderData.payment.totalAmount.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Paid Amount">
              {orderData.payment.paidAmount == null
                ? "Not paid"
                : `${orderData.payment.paidAmount.toFixed(2)} ${orderData.payment.currencyCode || ""}`}
            </Descriptions.Item>
            <Descriptions.Item label="Refunded Amount">
              {orderData.payment.refundedAmount.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Provider">
              {orderData.payment.provider || "Not assigned"}
            </Descriptions.Item>
            <Descriptions.Item label="Transaction Reference">
              {orderData.payment.externalTransactionId || "Not available"}
            </Descriptions.Item>
            <Descriptions.Item label="Provider Order Reference">
              {orderData.payment.providerPaymentId || "Not available"}
            </Descriptions.Item>
            <Descriptions.Item label="Expires At">
              {orderData.payment.expiresAt || "Not applicable"}
            </Descriptions.Item>
            <Descriptions.Item label="Cancellation / Failure Reason">
              {orderData.payment.cancellationReason || "Not available"}
            </Descriptions.Item>
            {orderData.payment.createdAt && (
              <Descriptions.Item label="Payment Date">
                {orderData.payment.createdAt}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* Order Items */}
        <Card title="Order Items" bordered={false}>
          <Table
            columns={orderItemColumns}
            dataSource={orderData.orderItems}
            rowKey="id"
            pagination={false}
            summary={(pageData) => {
              const totalAmount = pageData.reduce(
                (sum, item) => sum + item.quantity * item.unitPrice,
                0,
              );
              return (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3}>
                      <Text strong>Total</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong>{totalAmount.toFixed(2)}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              );
            }}
          />
        </Card>
      </Space>
    </div>
  );
}

export default OrderPage;
