import LoginForm from "../../components/ui/forms/loginForm/LoginForm.tsx";
import { loginService } from "../../service/apiServices/authServices.ts";
import { useNavigate } from "react-router";
import { useState } from "react";
import { ShopOutlined } from "@ant-design/icons";
import { Typography } from "antd";

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (values: any) => {
    try {
      setLoading(true);
      const res = await loginService(values);

      localStorage.setItem("accessToken", res.accessToken);

      await new Promise((resolve) => {
        const timer = setTimeout(() => {
          if (localStorage.getItem("accessToken")) {
            clearTimeout(timer);
            resolve(true);
          }
        }, 100);
      });

      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="login-brand">
          <span>
            <ShopOutlined />
          </span>
          <b>Commercor</b>
        </div>
        <div className="login-heading">
          <Typography.Title level={2}>Welcome back</Typography.Title>
          <Typography.Text type="secondary">
            Sign in to manage your commerce workspace.
          </Typography.Text>
        </div>
        <LoginForm
          disabled={loading}
          onFinish={handleLogin}
          layout="vertical"
        />
        <div className="login-footer">Secure administrator access</div>
      </div>
    </div>
  );
}

export default LoginPage;
