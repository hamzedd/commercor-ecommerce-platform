import CategoriesTable from "../../components/ui/tables/categoriesTable/CategoriesTable.tsx";
import { Alert, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getCategoriesService } from "../../service/apiServices/categoryServices.ts";
import type { CategoryType } from "../../utils/types/categoryTypes.ts";

function CategoriesPage() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getCategoriesService();
      setCategories(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <div className="management-page management-list-page">
      <header className="management-hero">
        <div>
          <span className="management-kicker">Catalog structure</span>
          <h1>Categories</h1>
          <p>
            Organize the storefront hierarchy and translated category content.
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/categories/add")}
        >
          Create Category
        </Button>
      </header>
      {error && (
        <Alert
          type="error"
          showIcon
          message="Categories could not be loaded"
          description="Check your connection and try again."
          action={<Button onClick={() => void fetchCategories()}>Retry</Button>}
        />
      )}
      <CategoriesTable
        data={categories}
        loading={loading}
        fetchData={fetchCategories}
      />
    </div>
  );
}

export default CategoriesPage;
