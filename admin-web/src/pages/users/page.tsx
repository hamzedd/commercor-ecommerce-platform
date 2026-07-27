import { Button, Space } from "antd";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import UsersTable from "../../components/ui/tables/usersTable/UsersTable.tsx";
import type { UserType } from "../../utils/types/userTypes.ts";
import { getUsersService } from "../../service/apiServices/usersServices.ts";

function UsersPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserType[]>([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setData(await getUsersService());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Space direction={"vertical"} className={"w-full"}>
      <Button type="primary" onClick={() => navigate("/admin/users/add")}>
        Add User
      </Button>
      <UsersTable
        data={data}
        fetchData={fetchUsers}
        loading={loading}
      ></UsersTable>
    </Space>
  );
}

export default UsersPage;
