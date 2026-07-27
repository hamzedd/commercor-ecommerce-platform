import { Space, Table } from "antd";
import { Link } from "react-router";
import usersTableColumns from "./components/usersTableColumns.tsx";
import type { UserType } from "../../../../utils/types/userTypes.ts";
import DeleteUser from "./components/userDelete.tsx";

interface Props {
  data?: UserType[];
  loading?: boolean;
  fetchData?: () => void;
}

export default function UsersTable({ data, loading, fetchData }: Props) {
  return (
    <Table
      className={"w-full"}
      columns={usersTableColumns.map((col) => ({
        ...col,
        render:
          col.key === "actions"
            ? (_, record) => (
                <Space>
                  <Link to={`/admin/users/edit/${record.id}`}>Edit</Link>
                  <DeleteUser
                    userId={record.id}
                    userName={record.translations?.[0]?.name}
                    onDeleted={fetchData}
                  />
                </Space>
              )
            : col?.render,
      }))}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 8 }}
    />
  );
}
