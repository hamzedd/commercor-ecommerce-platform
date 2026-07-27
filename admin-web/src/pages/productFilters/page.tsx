import { Button, Space } from "antd";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getProductFiltersService } from "../../service/apiServices/productFilterServices.ts";
import type { ProductFilterType } from "../../utils/types/productFilterTypes.ts";
import ProductFiltersTable from "../../components/ui/tables/productFiltersTable/productFiltersTable.tsx";

function ProductFiltersPage() {
  const [loading, setLoading] = useState(false);
  const [products, setProductFilters] = useState<ProductFilterType[]>([]);
  const navigate = useNavigate();

  const fetchProductFilters = async () => {
    try {
      setLoading(true);
      const data = await getProductFiltersService();
      setProductFilters(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductFilters();
  }, []);

  return (
    <Space direction={"vertical"} className={"w-full"}>
      <Button
        type="primary"
        onClick={() => navigate("/admin/product-filter/add")}
      >
        Add product Filter
      </Button>
      <ProductFiltersTable
        data={products}
        loading={loading}
        fetchData={fetchProductFilters}
      />
    </Space>
  );
}

export default ProductFiltersPage;
