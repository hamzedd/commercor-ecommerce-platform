// export const API_BASE_URL = "http://localhost:3000/api";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.toString().endsWith("/admin")
    ? import.meta.env.VITE_API_BASE_URL.toString()
    : import.meta.env.VITE_API_BASE_URL.toString().concat("/admin")
  : "/api/admin";
