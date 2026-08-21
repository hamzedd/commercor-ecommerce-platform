import axios from "axios";
import { apiNotifications } from "./apiNotificationService";

export const PENDING_CHECKOUT_MESSAGE = "Cart has a pending checkout";

function localizedCheckoutPath(paymentId: string) {
  const locale = window.location.pathname.split("/")[1] || "en";
  return `/${locale}/payment-status/${paymentId}`;
}

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
      apiNotifications.success(response.data.message);
    }
    return response;
  },
  async (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      window.localStorage.removeItem("accessToken");
    }
    const responseMessage = error?.response?.data?.message;
    if (responseMessage === PENDING_CHECKOUT_MESSAGE) {
      let paymentId: string | null = null;
      try {
        const cartResponse = await api.get("/cart");
        paymentId = cartResponse.data?.pendingPaymentId || null;
      } catch {
        // The original expected error remains the useful failure state.
      }
      apiNotifications.error({
        title: "Checkout in progress",
        description:
          "Your cart is currently in checkout. Finish the current checkout before adding more items.",
        actionLabel: paymentId ? "Continue checkout" : undefined,
        onAction: paymentId
          ? () => window.location.assign(localizedCheckoutPath(paymentId!))
          : undefined,
      });
    } else if (responseMessage) {
      apiNotifications.error({
        description: Array.isArray(responseMessage)
          ? responseMessage.join(" ")
          : responseMessage,
      });
    }
    return Promise.reject(error);
  },
);
export default api;
