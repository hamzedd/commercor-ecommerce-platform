import { Link, useParams } from "react-router";
import { Button, Tabs } from "antd";
import EditProductPageProductTab from "../../../../components/pageComponents/productEditPage/EditProductPageProductTab.tsx";
import EditProductPageFiltersTab from "../../../../components/pageComponents/productEditPage/EditProductPageFiltersTab.tsx";

function EditProductPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Product ID is missing</div>;
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
    <div className={"flex flex-col gap-5"}>
      <Link to={"/admin/products"}>
        <Button>Go Back</Button>
      </Link>
      <Tabs items={tabsItems} />
    </div>
  );
}

export default EditProductPage;
