import BrandsTable from "../../components/ui/tables/brandsTable/brandsTable.tsx";
import { Button, Space } from "antd";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { getBrandsService } from "../../service/apiServices/brandServices.ts";
import type { BrandType } from "../../utils/types/brandTypes.ts";

function BrandsPage() {
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<BrandType[]>([]);
  const navigate = useNavigate();

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const data = await getBrandsService();
      setBrands(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <Space direction={"vertical"} className={"w-full"}>
      <Button type="primary" onClick={() => navigate("/admin/brands/add")}>
        Add brand
      </Button>
      <BrandsTable data={brands} loading={loading} fetchData={fetchBrands} />
    </Space>
  );
}

export default BrandsPage;
