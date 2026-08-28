import {
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Divider,
  Drawer,
  Dropdown,
  Layout,
  Menu,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../../contexts/userContext/userContext.ts";
import defaultLayoutLinksList from "./componets/defaultLayoutLinksList.tsx";
import AssistantWidget from "../../assistant/AssistantWidget.tsx";

const { Header, Sider, Content } = Layout;

function DefaultLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetUser, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobile, setMobile] = useState(() => window.innerWidth < 1024);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const sync = () => setMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const visibleLinks = useMemo(
    () =>
      defaultLayoutLinksList.filter((item) => item.roles.includes(user.role)),
    [user.role],
  );
  const selectedKey = [...visibleLinks]
    .sort((a, b) => b.path.length - a.path.length)
    .find((item) =>
      item.path === "/admin"
        ? location.pathname === item.path
        : location.pathname.startsWith(item.path),
    )?.key;
  const current = visibleLinks.find((item) => item.key === selectedKey);
  const menuItems = visibleLinks.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: (
      <Link to={item.path} onClick={() => setMobileOpen(false)}>
        {item.label}
      </Link>
    ),
  }));

  const signOut = () => {
    resetUser();
    navigate("/admin/login");
  };
  const nav = (
    <div className="admin-nav">
      <div className="admin-brand">
        <span className="admin-brand-mark">
          <ShopOutlined />
        </span>
        <span className="admin-brand-copy">
          <b>Commercor</b>
          <small>Admin workspace</small>
        </span>
      </div>
      <div className="admin-nav-label">Workspace</div>
      <Menu
        mode="inline"
        selectedKeys={selectedKey ? [selectedKey] : []}
        items={menuItems}
      />
    </div>
  );

  return (
    <Layout className="admin-shell">
      {!mobile && (
        <Sider
          width={248}
          collapsedWidth={76}
          collapsed={collapsed}
          trigger={null}
          className="admin-sider"
        >
          {nav}
          <div className="admin-sider-footer">
            <Tooltip
              title={collapsed ? "Sign out" : undefined}
              placement="right"
            >
              <Button type="text" icon={<LogoutOutlined />} onClick={signOut}>
                {!collapsed && "Sign out"}
              </Button>
            </Tooltip>
          </div>
        </Sider>
      )}
      <Drawer
        placement="left"
        width={280}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        closable={false}
        styles={{ body: { padding: 0 } }}
      >
        {nav}
        <Divider className="!my-2" />
        <Button
          className="!mx-4"
          type="text"
          icon={<LogoutOutlined />}
          onClick={signOut}
        >
          Sign out
        </Button>
      </Drawer>
      <Layout className="admin-main">
        <Header className="admin-header">
          <div className="admin-header-start">
            <Button
              type="text"
              aria-label={mobile ? "Open navigation" : "Toggle navigation"}
              icon={
                mobile || collapsed ? (
                  <MenuUnfoldOutlined />
                ) : (
                  <MenuFoldOutlined />
                )
              }
              onClick={() =>
                mobile ? setMobileOpen(true) : setCollapsed(!collapsed)
              }
            />
            <div className="admin-page-context">
              <Typography.Text>
                {current?.label || "Administration"}
              </Typography.Text>
              <small>Manage your commerce operations</small>
            </div>
          </div>
          <div className="admin-header-actions">
            <Button
              type="text"
              aria-label="Notifications"
              icon={<BellOutlined />}
            />
            <Dropdown
              trigger={["click"]}
              menu={{
                items: [
                  {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: "Sign out",
                    onClick: signOut,
                  },
                ],
              }}
            >
              <button className="admin-profile" type="button">
                <Avatar size={34} icon={<UserOutlined />} />
                <span>
                  <b>{user.username || "Administrator"}</b>
                  <small>{user.email || user.role}</small>
                </span>
              </button>
            </Dropdown>
          </div>
        </Header>
        <Content className="admin-content">
          <div className="admin-content-inner">
            <Outlet />
          </div>
        </Content>
      </Layout>
      <AssistantWidget />
    </Layout>
  );
}

export default DefaultLayout;
