import BrandsTable from "../../components/ui/tables/brandsTable/brandsTable.tsx";
import { PlusOutlined } from "@ant-design/icons";
import { Alert, Button } from "antd";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { getBrandsService } from "../../service/apiServices/brandServices.ts";
import type { BrandType } from "../../utils/types/brandTypes.ts";

function BrandsPage() {
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getBrandsService();
      setBrands(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="management-page management-list-page">
      <header className="management-hero">
        <div>
          <span className="management-kicker">Catalog identity</span>
          <h1>Brands</h1>
          <p>
            Manage brand presentation, translated content, imagery, and ranking.
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/brands/add")}
        >
          Create Brand
        </Button>
      </header>
      {error && (
        <Alert
          type="error"
          showIcon
          message="Brands could not be loaded"
          description="Check your connection and try again."
          action={<Button onClick={() => void fetchBrands()}>Retry</Button>}
        />
      )}
      <BrandsTable data={brands} loading={loading} fetchData={fetchBrands} />
    </div>
  );
}

export default BrandsPage;
