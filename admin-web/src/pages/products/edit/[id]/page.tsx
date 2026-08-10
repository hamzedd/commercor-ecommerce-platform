import { Link, useParams } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Alert, Button, Tabs } from "antd";
import EditProductPageProductTab from "../../../../components/pageComponents/productEditPage/EditProductPageProductTab.tsx";
import EditProductPageFiltersTab from "../../../../components/pageComponents/productEditPage/EditProductPageFiltersTab.tsx";

function EditProductPage() {
  const { id } = useParams();

  if (!id) {
    return <Alert type="error" showIcon message="Product ID is missing" />;
  }

  const tabsItems = [
    {
      key: "product",
      label: "Product",
      children: <EditProductPageProductTab productId={id} />,
    },
    {
      key: "filters",
      label: "Filters",
      children: <EditProductPageFiltersTab productId={id} />,
    },
  ];

  return (
    <div className="management-page management-editor">
      <header className="management-editor__header">
        <Link to="/admin/products">
          <Button type="text" icon={<ArrowLeftOutlined />}>
            Products
          </Button>
        </Link>
        <div>
          <span className="management-kicker">Catalog</span>
          <h1>Edit product</h1>
          <p>Update product content or manage its assigned filters.</p>
        </div>
      </header>
      <section className="management-form-surface management-form-surface--tabs">
        <Tabs items={tabsItems} />
      </section>
    </div>
  );
}

export default EditProductPage;
