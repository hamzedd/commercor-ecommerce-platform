import { PlusOutlined } from "@ant-design/icons";
import { Alert, Button } from "antd";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getProductFiltersService } from "../../service/apiServices/productFilterServices.ts";
import type { ProductFilterType } from "../../utils/types/productFilterTypes.ts";
import ProductFiltersTable from "../../components/ui/tables/productFiltersTable/productFiltersTable.tsx";

function ProductFiltersPage() {
  const [loading, setLoading] = useState(false);
  const [productFilters, setProductFilters] = useState<ProductFilterType[]>([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fetchProductFilters = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getProductFiltersService();
      setProductFilters(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductFilters();
  }, []);

  return (
    <div className="management-page management-list-page">
      <header className="management-hero">
        <div>
          <span className="management-kicker">Catalog attributes</span>
          <h1>Product Filters</h1>
          <p>
            Manage filter types, translations, and their existing option
            relationships.
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/product-filter/add")}
        >
          Create Product Filter
        </Button>
      </header>
      {error && (
        <Alert
          type="error"
          showIcon
          message="Product filters could not be loaded"
          description="Check your connection and try again."
          action={
            <Button onClick={() => void fetchProductFilters()}>Retry</Button>
          }
        />
      )}
      <ProductFiltersTable
        data={productFilters}
        loading={loading}
        fetchData={fetchProductFilters}
      />
    </div>
  );
}

export default ProductFiltersPage;
