import LoginForm from "../../components/ui/forms/loginForm/LoginForm.tsx";
import { loginService } from "../../service/apiServices/authServices.ts";
import { useNavigate } from "react-router";
import { useState } from "react";

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
    <div className={"h-full w-full flex items-center justify-center"}>
      <LoginForm
        disabled={loading}
        onFinish={handleLogin}
        layout={"vertical"}
        className={"max-w-[500px] w-full !py-20"}
      ></LoginForm>
    </div>
  );
}

export default LoginPage;
