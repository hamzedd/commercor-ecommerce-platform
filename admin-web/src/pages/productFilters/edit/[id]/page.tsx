import { Link, useParams } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Alert, Button, Tabs } from "antd";
import ProductFilterEditTab from "../../../../components/pageComponents/productFilterEditPage/ProductFilterEditTab.tsx";
import ProductFilterOptionsTab from "../../../../components/pageComponents/productFilterEditPage/ProductFilterOptionsTab.tsx";

function EditProductFilterPage() {
  const { id } = useParams();
  if (!id) {
    return (
      <Alert type="error" showIcon message="Product filter ID is missing" />
    );
  }
  const tabs = [
    {
      key: "Filter Info",
      label: "Filter Info",
      children: <ProductFilterEditTab filterId={id} />,
    },
    {
      key: "Filter Options",
      label: "Filter Options",
      children: <ProductFilterOptionsTab filterId={id} />,
    },
  ];
  return (
    <div className="management-page management-editor">
      <header className="management-editor__header">
        <Link to="/admin/product-filters">
          <Button type="text" icon={<ArrowLeftOutlined />}>
            Product Filters
          </Button>
        </Link>
        <div>
          <span className="management-kicker">Catalog attributes</span>
          <h1>Edit product filter</h1>
          <p>
            Update filter content or manage its existing option relationships.
          </p>
        </div>
      </header>
      <section className="management-form-surface management-form-surface--tabs">
        <Tabs items={tabs} />
      </section>
    </div>
  );
}

export default EditProductFilterPage;
