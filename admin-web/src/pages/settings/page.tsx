import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import {
  getStoreSettingsService,
  updateStoreSettingsService,
} from "../../service/apiServices/storeSettingsServices.ts";
import type { StoreSettingsType } from "../../utils/types/storeSettingsTypes.ts";

const textFields: Array<[keyof StoreSettingsType, string]> = [
  ["logo", "Logo"],
  ["favicon", "Favicon"],
  ["openGraphImage", "OG Image"],
  ["phone", "Contact Phone"],
  ["address", "Address"],
];
const urlFields: Array<[keyof StoreSettingsType, string]> = [
  ["facebookUrl", "Facebook"],
  ["instagramUrl", "Instagram"],
  ["twitterUrl", "X"],
  ["linkedinUrl", "LinkedIn"],
  ["youtubeUrl", "YouTube"],
];

function getApiError(error: unknown) {
  if (!(error instanceof AxiosError)) return "Something went wrong.";
  const data = error.response?.data as
    | { message?: string; errors?: unknown }
    | undefined;
  if (data?.message) return data.message;
  if (data?.errors) {
    return typeof data.errors === "string"
      ? data.errors
      : JSON.stringify(data.errors);
  }
  return error.message;
}

function SettingsPage() {
  const [form] = Form.useForm<StoreSettingsType>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    getStoreSettingsService()
      .then((settings) => form.setFieldsValue(settings))
      .catch((requestError) => setError(getApiError(requestError)))
      .finally(() => setLoading(false));
  }, [form]);

  const onFinish = async (values: StoreSettingsType) => {
    try {
      setSaving(true);
      setError(undefined);
      const settings = await updateStoreSettingsService(values);
      form.setFieldsValue(settings);
      message.success("Store settings saved successfully.");
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spin size="large" />;

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Typography.Title level={2}>Store Settings</Typography.Title>
      {error && (
        <Alert
          type="error"
          showIcon
          closable
          message="Store settings request failed"
          description={error}
          onClose={() => setError(undefined)}
        />
      )}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card title="Store identity and contact">
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="storeName"
                label="Store Name"
                rules={[{ required: true, message: "Store name is required." }]}
              >
                <Input maxLength={255} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="contactEmail"
                label="Contact Email"
                rules={[{ type: "email", message: "Enter a valid email." }]}
              >
                <Input />
              </Form.Item>
            </Col>
            {textFields.map(([name, label]) => (
              <Col xs={24} lg={12} key={name}>
                <Form.Item name={name} label={label}>
                  {name === "address" ? (
                    <Input.TextArea rows={2} />
                  ) : (
                    <Input
                      placeholder={
                        ["logo", "favicon", "openGraphImage"].includes(name)
                          ? "Image URL or stored object name"
                          : undefined
                      }
                    />
                  )}
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Card>
        <Card title="Social links" className="mt-5">
          <Row gutter={16}>
            {urlFields.map(([name, label]) => (
              <Col xs={24} lg={12} key={name}>
                <Form.Item
                  name={name}
                  label={label}
                  rules={[{ type: "url", message: "Enter a valid URL." }]}
                >
                  <Input placeholder="https://" />
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Card>
        <Card title="Appearance and localization" className="mt-5">
          <Row gutter={16}>
            {[
              ["primaryColor", "Primary Color"],
              ["accentColor", "Accent Color"],
            ].map(([name, label]) => (
              <Col xs={24} md={12} lg={6} key={name}>
                <Form.Item
                  name={name}
                  label={label}
                  rules={[
                    { required: true, message: label + " is required." },
                    {
                      pattern: /^#[0-9a-fA-F]{6}$/,
                      message: "Use a six-digit hex color.",
                    },
                  ]}
                >
                  <Input type="color" />
                </Form.Item>
              </Col>
            ))}
            <Col xs={24} md={12} lg={6}>
              <Form.Item
                name="currencyCode"
                label="Currency Code"
                normalize={(value: string) => value.toUpperCase()}
                rules={[
                  { required: true, message: "Currency code is required." },
                  { len: 3, message: "Use a three-letter currency code." },
                ]}
              >
                <Input maxLength={3} placeholder="USD" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Form.Item
                name="defaultLocale"
                label="Default Locale"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: "en", label: "English (en)" },
                    { value: "ka", label: "Georgian (ka)" },
                    { value: "es", label: "Spanish (es)" },
                    { value: "ru", label: "Russian (ru)" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="Home page metadata" className="mt-5">
          <Form.Item name="homeMetaTitle" label="Home Meta Title">
            <Input maxLength={255} showCount />
          </Form.Item>
          <Form.Item
            name="homeMetaDescription"
            label="Home Meta Description"
          >
            <Input.TextArea rows={4} maxLength={1000} showCount />
          </Form.Item>
        </Card>
        <Button
          className="mt-5"
          type="primary"
          htmlType="submit"
          loading={saving}
        >
          Save Settings
        </Button>
      </Form>
    </Space>
  );
}

export default SettingsPage;
