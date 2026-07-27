import axios from "axios";
import { API_BASE_URL } from "../../utils/contants/environmentConstants.ts";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
