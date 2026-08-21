import axios from "axios";
import { API_BASE_URL } from "../../utils/contants/environmentConstants.ts";
import { reportAdminApiError } from "./adminNotificationService.ts";

const adminApi = axios.create({
  baseURL: API_BASE_URL,
});

adminApi.interceptors.request.use((req) => {
  if (
    typeof window !== "undefined" &&
    window.localStorage.getItem("accessToken")
  ) {
    req.headers.authorization = `Bearer ${localStorage.getItem("accessToken") || ""}`;
  }
  return req;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      window.localStorage.removeItem("accessToken");
      window.location.href = "/admin/login";
    }
    if (error?.response?.data?.message) {
      reportAdminApiError(error.response.data.message);
    }
    return Promise.reject(error);
  },
);

export default adminApi;
