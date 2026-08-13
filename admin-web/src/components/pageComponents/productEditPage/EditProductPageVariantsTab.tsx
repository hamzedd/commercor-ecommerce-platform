import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Typography,
  message,
} from "antd";
import {
  addVariantOption,
  createVariant,
  deleteVariant,
  getVariants,
  updateVariant,
} from "../../../service/apiServices/productVariantServices.ts";
import type {
  ProductVariant,
  VariantData,
  VariantInput,
} from "../../../utils/types/productVariantTypes.ts";
export default function EditProductPageVariantsTab({
  productId,
}: {
  productId: string;
}) {
  const [data, setData] = useState<VariantData>({ options: [], variants: [] }),
    [optionOpen, setOptionOpen] = useState(false),
    [variantOpen, setVariantOpen] = useState(false),
    [editing, setEditing] = useState<ProductVariant>();
  const [of] = Form.useForm(),
    [vf] = Form.useForm();
  const load = () => getVariants(productId).then(setData);
  useEffect(() => {
    load();
  }, [productId]);
  const saveOption = async (v: { name: string; values: string }) => {
    await addVariantOption(productId, {
      name: v.name,
      values: v.values.split(",").map((x) => x.trim()),
    });
    message.success("Variant option added");
    setOptionOpen(false);
    of.resetFields();
    load();
  };
  const edit = (v?: ProductVariant) => {
    setEditing(v);
    vf.resetFields();
    vf.setFieldsValue(v ? { ...v, selection: Object.fromEntries(v.selections.map((s) => [s.optionId, s.valueId])) } : { stock: 0, enabled: true });
    setVariantOpen(true);
  };
  const saveVariant = async (v: VariantInput & { selection: Record<string,string> }) => {
    const payload = { ...v, optionValueIds: Object.values(v.selection || {}) };
    editing
      ? await updateVariant(productId, editing.id, payload)
      : await createVariant(productId, payload);
    message.success("Variant saved");
    setVariantOpen(false);
    load();
  };
  return (
    <Space direction="vertical" className="w-full" size="large">
      <Card
        title="Variant-driving options"
        extra={<Button onClick={() => setOptionOpen(true)}>Add option</Button>}
      >
        {data.options.length ? (
          data.options.map((o) => (
            <p key={o.id}>
              <b>{o.name}:</b> {o.values.map((v) => v.value).join(", ")}
            </p>
          ))
        ) : (
          <Typography.Text type="secondary">
            No variants configured. This product remains a simple product.
          </Typography.Text>
        )}
      </Card>
      {data.options.length > 0 && (
        <Card
          title="Sellable variants"
          extra={
            <Button type="primary" onClick={() => edit()}>
              Add variant
            </Button>
          }
        >
          <Table
            rowKey="id"
            scroll={{ x: 700 }}
            dataSource={data.variants}
            columns={[
              { title: "Variant", dataIndex: "description" },
              { title: "SKU", dataIndex: "sku" },
              {
                title: "Price override",
                dataIndex: "priceOverride",
                render: (v) => v ?? "Base price",
              },
              { title: "Stock", dataIndex: "stock" },
              {
                title: "Enabled",
                render: (_, v) => (
                  <Switch
                    checked={v.enabled}
                    onChange={(enabled) =>
                      updateVariant(productId, v.id, {
                        sku: v.sku,
                        priceOverride: v.priceOverride,
                        stock: v.stock,
                        enabled,
                        optionValueIds: v.selections.map((s) => s.valueId),
                      }).then(load)
                    }
                  />
                ),
              },
              {
                title: "Actions",
                render: (_, v) => (
                  <Space>
                    <Button onClick={() => edit(v)}>Edit</Button>
                    <Popconfirm
                      title="Delete or disable this variant?"
                      onConfirm={() =>
                        deleteVariant(productId, v.id).then(load)
                      }
                    >
                      <Button danger>Delete</Button>
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
          />
        </Card>
      )}
      <Modal
        open={optionOpen}
        title="Add variant option"
        onCancel={() => setOptionOpen(false)}
        onOk={() => of.submit()}
      >
        <Form form={of} layout="vertical" onFinish={saveOption}>
          <Form.Item
            name="name"
            label="Option name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Color" />
          </Form.Item>
          <Form.Item
            name="values"
            label="Values (comma separated)"
            rules={[{ required: true }]}
          >
            <Input placeholder="Black, White" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={variantOpen}
        title={editing ? "Edit variant" : "Add variant"}
        onCancel={() => setVariantOpen(false)}
        onOk={() => vf.submit()}
      >
        <Form form={vf} layout="vertical" onFinish={saveVariant}>
          {data.options.map((o) => (
            <Form.Item
              key={o.id}
              name={["selection", o.id]}
              label={o.name}
              rules={[{ required: true }]}
              getValueFromEvent={(v) => v}
            >
              <Select
                options={o.values.map((v) => ({ value: v.id, label: v.value }))}
              />
            </Form.Item>
          ))}
          <Form.Item name="sku" label="SKU">
            <Input />
          </Form.Item>
          <Form.Item name="priceOverride" label="Price override">
            <InputNumber min={0.01} precision={2} className="w-full" />
          </Form.Item>
          <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
            <InputNumber min={0} precision={0} className="w-full" />
          </Form.Item>
          <Form.Item name="image" label="Existing image object name (optional)">
            <Input />
          </Form.Item>
          <Form.Item name="enabled" label="Enabled" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
