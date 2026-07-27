import axios from "axios";
import { message } from "antd";

const api = axios.create({
  baseURL:
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_SSR_API_BASE_URL
      : process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token =
    typeof window === "undefined"
      ? null
      : window.localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response?.data?.message) {
      message.success(response.data.message);
    }
    return response;
  },
  (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      window.localStorage.removeItem("accessToken");
    }
    if (error?.response?.data?.message) {
      message.error(error.response.data.message);
    }
    return Promise.reject(error);
  },
);
export default api;
