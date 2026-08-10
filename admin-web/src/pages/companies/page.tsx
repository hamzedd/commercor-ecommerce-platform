import CompaniesTable from "../../components/ui/tables/companiesTable/CompaniesTable.tsx";
import { PlusOutlined } from "@ant-design/icons";
import { Alert, Button } from "antd";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getCompaniesService } from "../../service/apiServices/companyServices.ts";
import type { CompanyDetailType } from "../../utils/types/companyDetailTypes.ts";

function CompaniesPage() {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<CompanyDetailType[]>([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getCompaniesService();
      setCompanies(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);
  return (
    <div className="management-page management-list-page">
      <header className="management-hero">
        <div>
          <span className="management-kicker">Store content</span>
          <h1>Companies</h1>
          <p>Manage the existing company details used across the storefront.</p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/companies/add")}
        >
          Create Company Detail
        </Button>
      </header>
      {error && (
        <Alert
          type="error"
          showIcon
          message="Company details could not be loaded"
          description="Check your connection and try again."
          action={<Button onClick={() => void fetchCompanies()}>Retry</Button>}
        />
      )}
      <CompaniesTable
        data={companies}
        loading={loading}
        fetchData={fetchCompanies}
      />
    </div>
  );
}

export default CompaniesPage;
