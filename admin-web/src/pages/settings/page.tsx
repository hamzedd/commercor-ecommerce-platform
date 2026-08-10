import { SaveOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  ColorPicker,
  Form,
  Input,
  Select,
  Skeleton,
  Upload,
  message,
} from "antd";
import type { UploadFile } from "antd";
import { useCallback, useEffect, useState } from "react";
import {
  getStoreSettingsService,
  updateStoreSettingsService,
} from "../../service/apiServices/storeSettingsServices";
import type { StoreSettingsType } from "../../utils/types/storeSettingsTypes";
import getImageSrcByBucketAndFileNames from "../../utils/functions/getImageSrcByBucketAndFileNames";

const uploadValue = (event: { fileList: UploadFile[] }) => event.fileList;
const imageList = (name?: string): UploadFile[] =>
  name
    ? [
        {
          uid: name,
          name,
          status: "done",
          url: getImageSrcByBucketAndFileNames({
            bucketName: "commercor",
            fileName: name,
          }),
        },
      ]
    : [];
const urlRule = {
  type: "url" as const,
  message: "Enter a complete URL including https://",
};
const hexRule = {
  pattern: /^#[0-9A-Fa-f]{6}$/,
  message: "Use a six-digit hex color, for example #1c1917",
};
const formValues = (data: StoreSettingsType): StoreSettingsType => ({
  ...data,
  logo: imageList(data.logo as string),
  favicon: imageList(data.favicon as string),
  openGraphImage: imageList(data.openGraphImage as string),
  removeLogo: false,
  removeFavicon: false,
  removeOpenGraphImage: false,
});

function SettingsPage() {
  const [form] = Form.useForm<StoreSettingsType>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [dirty, setDirty] = useState(false);
  const primaryColor = Form.useWatch("primaryColor", form);
  const accentColor = Form.useWatch("accentColor", form);
  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getStoreSettingsService();
      form.setFieldsValue(formValues(data));
      setDirty(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [form]);
  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const save = async (values: StoreSettingsType) => {
    try {
      setSaving(true);
      const data = await updateStoreSettingsService(values);
      form.setFieldsValue(formValues(data));
      setDirty(false);
      message.success("Store settings saved");
    } catch {
      message.error("Store settings could not be saved");
    } finally {
      setSaving(false);
    }
  };
  const imageField = (
    name: "logo" | "favicon" | "openGraphImage",
    label: string,
    remove: "removeLogo" | "removeFavicon" | "removeOpenGraphImage",
  ) => (
    <Form.Item
      label={label}
      name={name}
      valuePropName="fileList"
      getValueFromEvent={uploadValue}
    >
      <Upload
        listType="picture-card"
        accept="image/png,image/jpeg,image/webp"
        maxCount={1}
        beforeUpload={() => false}
        onRemove={() => {
          form.setFieldValue(remove, true);
          return true;
        }}
      >
        <span>Upload</span>
      </Upload>
    </Form.Item>
  );
  return (
    <div className="management-page settings-page">
      <header className="management-hero">
        <div>
          <span className="management-kicker">Store configuration</span>
          <h1>Store Settings</h1>
          <p>
            Manage storefront identity, contact details, appearance, regional
            defaults, and SEO.
          </p>
        </div>
      </header>
      {error && (
        <Alert
          type="error"
          showIcon
          message="Store settings could not be loaded"
          action={<Button onClick={() => void load()}>Retry</Button>}
        />
      )}
      {loading ? (
        <section className="management-form-surface">
          <Skeleton active paragraph={{ rows: 12 }} />
        </section>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={save}
          onValuesChange={() => setDirty(true)}
          className="settings-form"
        >
          <section className="settings-card">
            <h2>Store Identity</h2>
            <p>The name and imagery customers use to recognize your store.</p>
            <div className="settings-grid">
              <Form.Item
                label="Store name"
                name="storeName"
                rules={[{ required: true }, { min: 2, max: 120 }]}
              >
                <Input />
              </Form.Item>
              {imageField("logo", "Logo", "removeLogo")}
              {imageField("favicon", "Favicon", "removeFavicon")}
            </div>
          </section>
          <section className="settings-card">
            <h2>Contact Information</h2>
            <p>Public details customers can use to reach the store.</p>
            <div className="settings-grid">
              <Form.Item
                label="Contact email"
                name="contactEmail"
                rules={[{ type: "email" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Phone" name="phone">
                <Input maxLength={40} />
              </Form.Item>
              <Form.Item
                className="settings-span"
                label="Address"
                name="address"
              >
                <Input.TextArea rows={3} maxLength={500} showCount />
              </Form.Item>
            </div>
          </section>
          <section className="settings-card">
            <h2>Social Media</h2>
            <p>Optional links shown in the storefront footer.</p>
            <div className="settings-grid">
              {[
                ["facebookUrl", "Facebook"],
                ["instagramUrl", "Instagram"],
                ["twitterUrl", "X / Twitter"],
                ["linkedinUrl", "LinkedIn"],
                ["youtubeUrl", "YouTube"],
              ].map(([name, label]) => (
                <Form.Item
                  key={name}
                  label={label}
                  name={name}
                  rules={[urlRule]}
                >
                  <Input placeholder="https://" />
                </Form.Item>
              ))}
            </div>
          </section>
          <section className="settings-card">
            <h2>Storefront Appearance</h2>
            <p>Preview the two colors used by customer-facing accents.</p>
            <div className="settings-grid">
              {[
                ["primaryColor", "Primary color"],
                ["accentColor", "Accent color"],
              ].map(([name, label]) => (
                <Form.Item
                  key={name}
                  label={label}
                  name={name}
                  rules={[hexRule]}
                  getValueFromEvent={(color) => color.toHexString()}
                >
                  <ColorPicker showText format="hex" />
                </Form.Item>
              ))}
              <div
                className="settings-color-preview"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor || "#1c1917"}, ${accentColor || "#d97706"})`,
                }}
              >
                <span>Live storefront preview</span>
              </div>
            </div>
          </section>
          <section className="settings-card">
            <h2>Regional</h2>
            <p>
              Formatting and initial language for the existing storefront
              locales.
            </p>
            <div className="settings-grid">
              <Form.Item
                label="Currency code"
                name="currencyCode"
                rules={[
                  { required: true },
                  {
                    pattern: /^[A-Z]{3}$/,
                    message: "Use a three-letter uppercase code",
                  },
                ]}
              >
                <Input maxLength={3} />
              </Form.Item>
              <Form.Item
                label="Default language"
                name="defaultLocale"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: "en", label: "English" },
                    { value: "ka", label: "Georgian" },
                    { value: "es", label: "Spanish" },
                    { value: "ru", label: "Russian" },
                  ]}
                />
              </Form.Item>
            </div>
          </section>
          <section className="settings-card">
            <h2>SEO</h2>
            <p>
              Default metadata used when storefront pages are shared or indexed.
            </p>
            <div className="settings-grid">
              <Form.Item label="Home meta title" name="homeMetaTitle">
                <Input maxLength={120} showCount />
              </Form.Item>
              <Form.Item
                className="settings-span"
                label="Home meta description"
                name="homeMetaDescription"
              >
                <Input.TextArea rows={3} maxLength={320} showCount />
              </Form.Item>
              {imageField(
                "openGraphImage",
                "Open Graph image",
                "removeOpenGraphImage",
              )}
            </div>
          </section>
          <div className="settings-save-bar">
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={saving}
              disabled={!dirty}
            >
              Save Changes
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}
export default SettingsPage;
