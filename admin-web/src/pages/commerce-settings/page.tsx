import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, InputNumber, Row, Select, Space, Spin, Switch, Typography, message } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { getCommerceSettings, updateCommerceSettings } from '../../service/apiServices/commerceSettingsServices.ts';
import type { CommerceSettings } from '../../utils/types/commerceSettingsTypes.ts';

const countryCodes = 'AF AL DZ AS AD AO AI AG AR AM AW AU AZ BS BH BD BB BY BE BZ BJ BM BT BO BA BW BR IO VG VI BN BG BF BI KH CM CA CV KY CF CL CN CO KM CG CD CK CR HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE ET FK FO FJ FI FR GF PF GA GM GE DE GH GI GR GL GD GP GU GT GN GW GY HT VA HN HK HU IS IN ID CI IR IQ IE IL IT JM JP JO KZ KE KI KW KG LA LV LB LS LR LY LI LT LU MO MK MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU NF KP MP NO OM PK PW PS PA PG PY PE PH PL PT PR QA XK RE RO RU RW BL SH KN LC MF PM VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA KR ES LK SD SR SZ SE CH SY TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB US UY UZ VU VE VN WF YE ZM ZW'.split(' ');
const displayNames = typeof Intl !== 'undefined' && 'DisplayNames' in Intl ? new Intl.DisplayNames(['en'], { type: 'region' }) : null;
const countryOptions = countryCodes.map((code) => ({ value: code, label: `${displayNames?.of(code) || code} (${code})` }));

function CommerceSettingsPage() {
  const [form] = Form.useForm<CommerceSettings>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();
  useEffect(() => { getCommerceSettings().then((data) => form.setFieldsValue(data)).catch((e) => setError(e?.response?.data?.message || e.message)).finally(() => setLoading(false)); }, [form]);
  const save = async (values: CommerceSettings) => { try { setSaving(true); setError(undefined); const result = await updateCommerceSettings(values); form.setFieldsValue(result); message.success('Shipping and tax settings saved.'); } catch (e: unknown) { const requestError = e as { response?: { data?: { message?: string; errors?: unknown } }; message?: string }; setError(requestError.response?.data?.message || (requestError.response?.data?.errors ? JSON.stringify(requestError.response.data.errors) : requestError.message) || 'Save failed.'); } finally { setSaving(false); } };
  if (loading) return <Spin size="large" />;
  return <Space direction="vertical" size="large" className="w-full">
    <div><Typography.Text className="uppercase tracking-widest text-amber-700">Commerce</Typography.Text><Typography.Title level={2}>Shipping &amp; Tax</Typography.Title></div>
    {error && <Alert type="error" showIcon closable message="Commerce settings request failed" description={error} onClose={() => setError(undefined)} />}
    <Form form={form} layout="vertical" onFinish={save} initialValues={{ shippingEnabled: false, defaultShippingFee: 0, taxEnabled: false, defaultTaxRate: 0, pricesIncludeTax: false, countryRules: [] }}>
      <Card title="Shipping" className="border-stone-200">
        <Row gutter={20}><Col xs={24} md={8}><Form.Item name="shippingEnabled" label="Shipping enabled" valuePropName="checked"><Switch /></Form.Item></Col><Col xs={24} md={8}><Form.Item name="defaultShippingFee" label="Default shipping fee" rules={[{ required: true }, { type: 'number', min: 0 }]}><InputNumber min={0} precision={2} className="w-full" /></Form.Item></Col><Col xs={24} md={8}><Form.Item name="freeShippingThreshold" label="Free shipping threshold (optional)" rules={[{ type: 'number', min: 0 }]}><InputNumber min={0} precision={2} className="w-full" placeholder="No threshold" /></Form.Item></Col></Row>
      </Card>
      <Card title="Tax" className="border-stone-200">
        <Row gutter={20}><Col xs={24} md={8}><Form.Item name="taxEnabled" label="Tax enabled" valuePropName="checked"><Switch /></Form.Item></Col><Col xs={24} md={8}><Form.Item name="defaultTaxRate" label="Default tax rate (%)" rules={[{ required: true }, { type: 'number', min: 0, max: 100 }]}><InputNumber min={0} max={100} precision={2} className="w-full" /></Form.Item></Col><Col xs={24} md={8}><Form.Item name="pricesIncludeTax" label="Prices include tax" valuePropName="checked"><Switch /></Form.Item></Col></Row>
        <Alert type="info" showIcon message="Tax is calculated on the product subtotal; shipping is not taxable in v1." />
      </Card>
      <Card title="Country overrides" className="border-stone-200">
        <Form.List name="countryRules">{(fields, { add, remove }) => <Space direction="vertical" className="w-full" size="middle">
          {fields.map(({ key, name }) => <Card key={key} size="small"><Row gutter={12} align="middle">
            <Col xs={24} md={6}><Form.Item name={[name, 'countryCode']} label="Country" dependencies={['countryRules']} rules={[{ required: true }, ({ getFieldValue }) => ({ validator(_, value) { const codes = (getFieldValue('countryRules') || []).map((r: { countryCode?: string }) => r?.countryCode).filter(Boolean); return codes.filter((code: string) => code === value).length > 1 ? Promise.reject(new Error('Country rules must be unique.')) : Promise.resolve(); } })]}><Select showSearch optionFilterProp="label" options={countryOptions} /></Form.Item></Col>
            <Col xs={12} md={3}><Form.Item name={[name, 'shippingEnabled']} label="Ship" valuePropName="checked"><Switch /></Form.Item></Col><Col xs={12} md={4}><Form.Item name={[name, 'shippingFee']} label="Fee" rules={[{ type: 'number', min: 0 }]}><InputNumber min={0} precision={2} className="w-full" /></Form.Item></Col><Col xs={12} md={4}><Form.Item name={[name, 'freeShippingThreshold']} label="Free at" rules={[{ type: 'number', min: 0 }]}><InputNumber min={0} precision={2} className="w-full" /></Form.Item></Col>
            <Col xs={12} md={3}><Form.Item name={[name, 'taxEnabled']} label="Tax" valuePropName="checked"><Switch /></Form.Item></Col><Col xs={18} md={3}><Form.Item name={[name, 'taxRate']} label="Rate %" rules={[{ type: 'number', min: 0, max: 100 }]}><InputNumber min={0} max={100} precision={2} className="w-full" /></Form.Item></Col><Col xs={6} md={1}><Button danger type="text" aria-label="Remove country rule" icon={<DeleteOutlined />} onClick={() => remove(name)} /></Col>
          </Row></Card>)}
          <Button type="dashed" icon={<PlusOutlined />} onClick={() => add({ shippingEnabled: true, shippingFee: 0, freeShippingThreshold: null, taxEnabled: true, taxRate: 0 })}>Add country rule</Button>
        </Space>}</Form.List>
      </Card>
      <Button type="primary" htmlType="submit" loading={saving} size="large">Save Commerce Settings</Button>
    </Form>
  </Space>;
}
export default CommerceSettingsPage;
