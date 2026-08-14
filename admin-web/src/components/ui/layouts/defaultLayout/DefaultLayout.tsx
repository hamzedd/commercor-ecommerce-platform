import { Button, Layout, Menu, theme } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import defaultLayoutLinksList from "./componets/defaultLayoutLinksList.tsx";
import { useAuth } from "../../../contexts/userContext/userContext.ts";

const { Header, Sider, Content } = Layout;

function DefaultLayout() {
  const navigate = useNavigate();
  const { resetUser, user } = useAuth();
  const [collapsed, setCollapsed] = useState(
    () => window.matchMedia("(max-width: 991px)").matches,
  );

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className={"h-full"}>
      <Sider
        collapsible
        collapsed={collapsed}
        collapsedWidth={0}
        breakpoint="lg"
        onBreakpoint={setCollapsed}
        trigger={null}
        className="max-lg:!fixed max-lg:!inset-y-0 max-lg:!start-0 max-lg:!z-50"
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            ...defaultLayoutLinksList
              .filter((item) => item.roles.includes(user.role))
              .map((item) => ({
                key: item.key,
                icon: item.icon,
                label: <Link to={item.path}>{item.label}</Link>,
              })),
            {
              key: "logout",
              icon: <MenuUnfoldOutlined />,
              label: (
                <span
                  onClick={() => {
                    resetUser();
                    navigate("/login");
                  }}
                >
                  Logout
                </span>
              ),
            },
          ]}
        />
      </Sider>
      <Layout className="min-w-0">
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "clamp(8px, 2vw, 24px) clamp(8px, 1.5vw, 16px)",
            padding: "clamp(12px, 2vw, 24px)",
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet></Outlet>
        </Content>
      </Layout>
    </Layout>
  );
}

export default DefaultLayout;
