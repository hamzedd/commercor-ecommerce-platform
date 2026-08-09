import {
  DownOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Drawer,
  Dropdown,
  Layout,
  Menu,
  type MenuProps,
} from "antd";
import { useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../../contexts/userContext/userContext.ts";
import defaultLayoutLinksList from "./componets/defaultLayoutLinksList.tsx";

const { Content, Sider } = Layout;

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      className={`admin-brand ${compact ? "admin-brand--compact" : ""}`}
      to="/admin"
      aria-label="Commercor dashboard"
    >
      <span className="admin-brand__mark" aria-hidden="true">
        C
      </span>
      {!compact && (
        <span className="admin-brand__text">
          <strong>Commercor</strong>
          <small>Administration</small>
        </span>
      )}
    </Link>
  );
}

function DefaultLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetUser, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const allowedLinks = useMemo(
    () =>
      defaultLayoutLinksList.filter((item) => item.roles.includes(user.role)),
    [user.role],
  );

  const selectedKey = useMemo(() => {
    const matches = allowedLinks.filter((item) =>
      item.path === "/admin"
        ? location.pathname === item.path
        : location.pathname.toLowerCase().startsWith(item.path.toLowerCase()),
    );
    return matches.sort((a, b) => b.path.length - a.path.length)[0]?.key;
  }, [allowedLinks, location.pathname]);

  const menuItems: MenuProps["items"] = allowedLinks.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: (
      <Link to={item.path} onClick={() => setMobileOpen(false)}>
        {item.label}
      </Link>
    ),
  }));

  const logout = () => {
    resetUser();
    navigate("/admin/login");
  };

  const accountItems: MenuProps["items"] = [
    {
      key: "identity",
      label: (
        <div className="account-summary">
          <strong>{user.username || "Admin account"}</strong>
          <span>{user.email || "Profile loading…"}</span>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sign out",
      danger: true,
      onClick: logout,
    },
  ];

  const navigation = (
    <Menu
      className="admin-menu"
      mode="inline"
      selectedKeys={selectedKey ? [selectedKey] : []}
      items={menuItems}
    />
  );

  return (
    <Layout className="admin-shell">
      <a className="skip-link" href="#admin-main">
        Skip to main content
      </a>
      <Sider
        className="admin-sidebar"
        width={272}
        collapsedWidth={88}
        collapsed={collapsed}
        trigger={null}
      >
        <Brand compact={collapsed} />
        <nav aria-label="Primary navigation">{navigation}</nav>
        <div className="admin-sidebar__footer">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {!collapsed && "Collapse sidebar"}
          </Button>
        </div>
      </Sider>

      <Drawer
        className="admin-mobile-drawer"
        placement="left"
        width="min(86vw, 320px)"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        destroyOnHidden
        closable={false}
        styles={{ body: { padding: 0 } }}
      >
        <Brand />
        <nav aria-label="Mobile navigation">{navigation}</nav>
      </Drawer>

      <Layout className="admin-workspace">
        <header className="admin-header">
          <div className="admin-header__leading">
            <Button
              className="admin-mobile-trigger"
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            />
            <div>
              <span className="admin-header__eyebrow">Commerce workspace</span>
              <strong className="admin-header__title">
                {allowedLinks.find((item) => item.key === selectedKey)?.label ||
                  "Administration"}
              </strong>
            </div>
          </div>
          <Dropdown
            menu={{ items: accountItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              className="admin-account"
              type="text"
              aria-label="Open admin account menu"
            >
              <Avatar icon={<UserOutlined />} />
              <span className="admin-account__copy">
                <strong>{user.username || "Admin"}</strong>
                <small>
                  {user.role
                    ? user.role.replace("_", " ").toLowerCase()
                    : "Loading profile"}
                </small>
              </span>
              <DownOutlined className="admin-account__chevron" />
            </Button>
          </Dropdown>
        </header>
        <Content id="admin-main" className="admin-content" tabIndex={-1}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default DefaultLayout;
