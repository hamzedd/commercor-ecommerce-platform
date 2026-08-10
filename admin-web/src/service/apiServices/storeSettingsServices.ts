import adminApi from "../apiInstances/adminApi";
import type { StoreSettingsType } from "../../utils/types/storeSettingsTypes";

export const getStoreSettingsService = () =>
  adminApi.get<StoreSettingsType>("/store-settings").then(({ data }) => data);

export const updateStoreSettingsService = (values: StoreSettingsType) => {
  const form = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      const file = value[0]?.originFileObj;
      if (file) form.append(key, file);
    } else if (value !== undefined && value !== null)
      form.append(key, String(value));
  });
  return adminApi
    .put<StoreSettingsType>("/store-settings", form)
    .then(({ data }) => data);
};
