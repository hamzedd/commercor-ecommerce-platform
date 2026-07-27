import CategoriesTable from "../../components/ui/tables/categoriesTable/CategoriesTable.tsx";
import { Button, Space } from "antd";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getCategoriesService } from "../../service/apiServices/categoryServices.ts";
import type { CategoryType } from "../../utils/types/categoryTypes.ts";

function CategoriesPage() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategoriesService();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <Space direction={"vertical"} className={"w-full"}>
      <Button type="primary" onClick={() => navigate("/admin/categories/add")}>
        Add Category
      </Button>
      <CategoriesTable
        data={categories}
        loading={loading}
        fetchData={fetchCategories}
      />
    </Space>
  );
}

export default CategoriesPage;
