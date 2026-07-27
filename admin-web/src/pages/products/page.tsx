import ProductsTable from "../../components/ui/tables/productsTable/ProductsTable.tsx";
import { Button, Space } from "antd";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getProductsService } from "../../service/apiServices/productServices.ts";
import type { ProductType } from "../../utils/types/productTypes.ts";

function ProductsPage() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductType[]>([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProductsService();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Space direction={"vertical"} className={"w-full"}>
      <Button type="primary" onClick={() => navigate("/admin/products/add")}>
        Add product
      </Button>
      <ProductsTable
        data={products}
        loading={loading}
        fetchData={fetchProducts}
      />
    </Space>
  );
}

export default ProductsPage;
