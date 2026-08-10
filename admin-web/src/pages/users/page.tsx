import { PlusOutlined } from "@ant-design/icons";
import { Alert, Button } from "antd";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import UsersTable from "../../components/ui/tables/usersTable/UsersTable.tsx";
import type { UserType } from "../../utils/types/userTypes.ts";
import { getUsersService } from "../../service/apiServices/usersServices.ts";

function UsersPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserType[]>([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(false);
      setData(await getUsersService());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="management-page management-list-page">
      <header className="management-hero">
        <div>
          <span className="management-kicker">Access control</span>
          <h1>Admin users</h1>
          <p>Manage administrative accounts and their assigned roles.</p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/users/add")}
        >
          Create Admin User
        </Button>
      </header>
      {error && (
        <Alert
          type="error"
          showIcon
          message="Admin users could not be loaded"
          description="Check your connection and try again."
          action={<Button onClick={() => void fetchUsers()}>Retry</Button>}
        />
      )}
      <UsersTable data={data} fetchData={fetchUsers} loading={loading} />
    </div>
  );
}

export default UsersPage;
