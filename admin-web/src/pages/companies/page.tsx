import CompaniesTable from "../../components/ui/tables/companiesTable/CompaniesTable.tsx";
import { Button, Space } from "antd";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getCompaniesService } from "../../service/apiServices/companyServices.ts";
import type { CompanyDetailType } from "../../utils/types/companyDetailTypes.ts";

function CompaniesPage() {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<CompanyDetailType[]>([]);
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await getCompaniesService();
      setCompanies(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);
  return (
    <Space direction={"vertical"} className={"w-full"}>
      <Button type="primary" onClick={() => navigate("/admin/companies/add")}>
        Add Company
      </Button>
      <CompaniesTable
        data={companies}
        loading={loading}
        fetchData={fetchCompanies}
      />
    </Space>
  );
}

export default CompaniesPage;
