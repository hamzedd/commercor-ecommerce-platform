import { Link, useParams } from "react-router";
import { Button, Tabs } from "antd";
import ProductFilterEditTab from "../../../../components/pageComponents/productFilterEditPage/ProductFilterEditTab.tsx";
import ProductFilterOptionsTab from "../../../../components/pageComponents/productFilterEditPage/ProductFilterOptionsTab.tsx";

function EditProductFilterPage() {
  const { id } = useParams();
  if (!id) {
    return;
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
    <div className={"flex flex-col gap-5"}>
      <Link to={"/admin/product-filters"}>
        <Button>Go Back</Button>
      </Link>
      <Tabs items={tabs}></Tabs>
    </div>
  );
}

export default EditProductFilterPage;
