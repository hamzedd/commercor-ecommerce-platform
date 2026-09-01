import { Link, useParams } from "react-router";
import { Button, Card, Descriptions, Form, Input, Table, Tag, Space, Timeline, Typography, message } from "antd";
import { NativeSelect } from "../../../components/ui/inputs/NativeSelectInput.tsx";
import type { ColumnsType } from "antd/es/table";
import type {
  OrderItemType,
  OrderType,
} from "../../../utils/types/orderTypes.ts";
import { useEffect, useState } from "react";
import { getOrderService } from "../../../service/apiServices/orderServices.ts";
import type { ProductType } from "../../../utils/types/productTypes.ts";
import { updateFulfillment } from "../../../service/apiServices/orderServices.ts";
import { formatMoney, toNumber } from "../../../utils/functions/money.ts";
import { markPaymentAsPaidService } from "../../../service/apiServices/paymentServices.ts";

const { Title, Text } = Typography;

const MANUAL_PAYMENT_PROVIDER_NAME = "manual";

function OrderPage() {
  const { id } = useParams();

  const [orderData, setOrderData] = useState<OrderType>();
  const [loading, setLoading] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [form]=Form.useForm();

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

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleMarkPaid = async () => {
    if (!orderData?.payment) return;
    try {
      setMarkingPaid(true);
      await markPaymentAsPaidService(orderData.payment.id);
      message.success("Payment marked as paid");
      await fetchData();
    } finally {
      setMarkingPaid(false);
    }
  };

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
      render: (unitPrice: OrderItemType["unitPrice"]) => formatMoney(unitPrice),
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) =>
        formatMoney(toNumber(record.quantity) * toNumber(record.unitPrice)),
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
              {formatMoney(orderData.productAmount)}
            </Descriptions.Item>
            <Descriptions.Item label="Delivery Amount">
              {formatMoney(orderData.deliveryAmount)}
            </Descriptions.Item>
            <Descriptions.Item label="Tax Amount">
              {formatMoney(orderData.taxAmount)}
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount">
              <Text strong>
                {formatMoney(
                  orderData.finalTotal ??
                    toNumber(orderData.productAmount) +
                      toNumber(orderData.deliveryAmount) +
                      toNumber(orderData.taxAmount),
                )}
              </Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Customer Information */}
        <Card title="Customer Information" bordered={false}>
          <Descriptions column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="Name">
              {orderData.customer
                ? `${orderData.customer.firstName} ${orderData.customer.lastName}`
                : "Not available"}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {orderData.customer?.email || "Not available"}
            </Descriptions.Item>
            <Descriptions.Item label="Username">
              {orderData.customer?.username || "Not available"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Delivery Address */}
        <Card title="Delivery Address" bordered={false}>
          <Descriptions column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="Country">
              {orderData.address?.country || "Not available"}
            </Descriptions.Item>
            <Descriptions.Item label="City">
              {orderData.address?.city || "Not available"}
            </Descriptions.Item>
            <Descriptions.Item label="Street">
              {orderData.address?.street || "Not available"}
            </Descriptions.Item>
            <Descriptions.Item label="Details">
              {orderData.address?.detail}
            </Descriptions.Item>
            <Descriptions.Item label="Contact Phone">
              {orderData.address?.phoneNumber || "Not available"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Payment Information */}
        <Card title="Payment Information" bordered={false}>
          <Descriptions column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="Payment ID">
              {orderData.payment?.id || "Not available"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {orderData.payment ? (
                <Tag color={getPaymentStatusColor(orderData.payment.status)}>
                  {orderData.payment.status.toUpperCase()}
                </Tag>
              ) : (
                "Not available"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Expected Amount">
              {orderData.payment
                ? formatMoney(orderData.payment.totalAmount)
                : "Not available"}
            </Descriptions.Item>
            <Descriptions.Item label="Paid Amount">
              {orderData.payment?.paidAmount == null
                ? "Not paid"
                : `${formatMoney(orderData.payment.paidAmount)} ${orderData.payment.currencyCode || ""}`}
            </Descriptions.Item>
            <Descriptions.Item label="Refunded Amount">
              {orderData.payment
                ? formatMoney(orderData.payment.refundedAmount)
                : "Not available"}
            </Descriptions.Item>
            <Descriptions.Item label="Provider">
              {orderData.payment?.provider || "Not assigned"}
            </Descriptions.Item>
            <Descriptions.Item label="Transaction Reference">
              {orderData.payment?.externalTransactionId || "Not available"}
            </Descriptions.Item>
            <Descriptions.Item label="Provider Order Reference">
              {orderData.payment?.providerPaymentId || "Not available"}
            </Descriptions.Item>
            <Descriptions.Item label="Expires At">
              {orderData.payment?.expiresAt || "Not applicable"}
            </Descriptions.Item>
            <Descriptions.Item label="Cancellation / Failure Reason">
              {orderData.payment?.cancellationReason || "Not available"}
            </Descriptions.Item>
            {orderData.payment?.createdAt && (
              <Descriptions.Item label="Payment Date">
                {orderData.payment.createdAt}
              </Descriptions.Item>
            )}
          </Descriptions>
          {orderData.payment?.provider === MANUAL_PAYMENT_PROVIDER_NAME &&
            orderData.payment?.status === "pending" && (
              <Button
                type="primary"
                className="mt-4"
                loading={markingPaid}
                onClick={handleMarkPaid}
              >
                Mark payment received
              </Button>
            )}
        </Card>
        <Card title="Fulfillment" bordered={false}><Descriptions column={{xs:1,sm:2}}><Descriptions.Item label="Status"><Tag>{orderData.fulfillmentStatus?.toUpperCase()}</Tag></Descriptions.Item><Descriptions.Item label="Carrier">{orderData.carrier||'Not assigned'}</Descriptions.Item><Descriptions.Item label="Tracking number">{orderData.trackingNumber||'Not assigned'}</Descriptions.Item><Descriptions.Item label="Tracking URL">{orderData.trackingUrl?<a href={orderData.trackingUrl} target="_blank" rel="noreferrer">Open tracking</a>:'Not assigned'}</Descriptions.Item><Descriptions.Item label="Processing at">{orderData.processingAt||'-'}</Descriptions.Item><Descriptions.Item label="Shipped at">{orderData.shippedAt||'-'}</Descriptions.Item><Descriptions.Item label="Delivered at">{orderData.deliveredAt||'-'}</Descriptions.Item></Descriptions><Timeline className="mt-5" items={(orderData.statusHistory||[]).map(h=>({children:<><b>{h.toStatus}</b> — {new Date(h.created_at).toLocaleString()}{h.note&&<p>{h.note}</p>}</>}))}/>{orderData.validNextFulfillmentStatuses?.length>0&&<Form form={form} layout="vertical" onFinish={async v=>{const updated=await updateFulfillment(String(id),v);setOrderData(prev=>prev?{...prev,...updated}:updated);message.success('Fulfillment updated')}} initialValues={{carrier:orderData.carrier,trackingNumber:orderData.trackingNumber,trackingUrl:orderData.trackingUrl}}><Form.Item name="fulfillmentStatus" label="Next status" rules={[{required:true}]}><NativeSelect className="w-full" options={orderData.validNextFulfillmentStatuses.map(v=>({value:v,label:v}))}/></Form.Item><Form.Item name="carrier" label="Carrier"><Input/></Form.Item><Form.Item name="trackingNumber" label="Tracking number"><Input/></Form.Item><Form.Item name="trackingUrl" label="Tracking URL" rules={[{type:'url'}]}><Input/></Form.Item><Form.Item name="note" label="Customer-visible note"><Input.TextArea maxLength={1000}/></Form.Item><Button htmlType="submit" type="primary">Update fulfillment</Button></Form>}</Card>

        {/* Order Items */}
        <Card title="Order Items" bordered={false}>
          <Table
            columns={orderItemColumns}
            dataSource={orderData.orderItems}
            rowKey="id"
            pagination={false}
            summary={(pageData) => {
              const totalAmount = pageData.reduce(
                (sum, item) =>
                  sum + toNumber(item.quantity) * toNumber(item.unitPrice),
                0,
              );
              return (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3}>
                      <Text strong>Total</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong>{formatMoney(totalAmount)}</Text>
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
