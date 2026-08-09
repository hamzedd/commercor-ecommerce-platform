import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import App from "./App.tsx";
import "./styles/index.css";
import "@ant-design/v5-patch-for-react-19";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#9b6a3c",
          colorInfo: "#9b6a3c",
          borderRadius: 10,
          fontFamily: '"Manrope", sans-serif',
          colorText: "#25211d",
        },
        components: {
          Button: { controlHeight: 40, fontWeight: 600 },
          Table: { headerBg: "#f6f3ef", headerColor: "#5d554d" },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
);
