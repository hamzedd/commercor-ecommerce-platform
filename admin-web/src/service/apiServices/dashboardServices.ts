import adminApi from "../apiInstances/adminApi.ts";
import type { DashboardType } from "../../utils/types/dashboardTypes.ts";

export async function getDashboardService(): Promise<DashboardType> {
  return adminApi.get<DashboardType>("/dashboard").then(({ data }) => data);
}
