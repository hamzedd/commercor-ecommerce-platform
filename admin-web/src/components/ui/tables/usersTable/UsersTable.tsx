import { EditOutlined } from "@ant-design/icons";
import { Button, Empty, Skeleton, Table, Tag } from "antd";
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
  const users = data ?? [];
  const formatRole = (role?: string) =>
    role ? role.replaceAll("_", " ").toLowerCase() : "Not assigned";
  const actions = (_: unknown, user: UserType) => (
    <div className="management-actions">
      <Link to={`/admin/users/edit/${user.id}`}>
        <Button type="text" icon={<EditOutlined />}>
          Edit
        </Button>
      </Link>
      <DeleteUser
        userId={user.id}
        userName={user.username}
        onDeleted={fetchData}
      />
    </div>
  );
  const columns = usersTableColumns.map((column) =>
    column.key === "actions" ? { ...column, render: actions } : column,
  );

  return (
    <section
      className="management-surface"
      aria-label="Admin user list"
      aria-busy={loading}
    >
      <div className="management-surface__heading">
        <div>
          <span>Access directory</span>
          <h2>All admin users</h2>
        </div>
        {!loading && (
          <span className="management-count">
            {users.length} {users.length === 1 ? "user" : "users"}
          </span>
        )}
      </div>
      <div className="management-desktop-table">
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="id"
          scroll={{ x: 760 }}
          pagination={{ pageSize: 8, hideOnSinglePage: true }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No admin users yet"
              />
            ),
          }}
        />
      </div>
      <div className="management-mobile-list">
        {loading ? (
          Array.from({ length: 3 }, (_, index) => (
            <div className="management-mobile-card" key={index}>
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </div>
          ))
        ) : users.length ? (
          users.map((user) => (
            <article className="management-mobile-card" key={user.id}>
              <div className="management-person management-person--mobile">
                <span className="management-person__avatar">
                  {(user.username?.[0] || "U").toUpperCase()}
                </span>
                <div>
                  <strong>{user.username || "Unnamed user"}</strong>
                  <span>{user.email || "No email available"}</span>
                </div>
              </div>
              <dl className="management-mobile-card__facts">
                <div>
                  <dt>Role</dt>
                  <dd>
                    <Tag color="gold">{formatRole(user.role)}</Tag>
                  </dd>
                </div>
              </dl>
              {actions(null, user)}
            </article>
          ))
        ) : (
          <Empty
            className="management-empty"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No admin users yet"
          />
        )}
      </div>
    </section>
  );
}
