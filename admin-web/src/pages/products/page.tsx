import ProductsTable from "../../components/ui/tables/productsTable/ProductsTable.tsx";
import { Alert, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getProductsService } from "../../service/apiServices/productServices.ts";
import type { ProductType } from "../../utils/types/productTypes.ts";

function ProductsPage() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getProductsService();
      setProducts(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="management-page management-list-page">
      <header className="management-hero">
        <div>
          <span className="management-kicker">Catalog</span>
          <h1>Products</h1>
          <p>Review pricing, inventory, and product content in one place.</p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/products/add")}
        >
          Create Product
        </Button>
      </header>
      {error && (
        <Alert
          type="error"
          showIcon
          message="Products could not be loaded"
          description="Check your connection and try again."
          action={<Button onClick={() => void fetchProducts()}>Retry</Button>}
        />
      )}
      <ProductsTable
        data={products}
        loading={loading}
        fetchData={fetchProducts}
      />
    </div>
  );
}

export default ProductsPage;
