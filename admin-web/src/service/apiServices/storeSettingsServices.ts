import adminApi from "../apiInstances/adminApi.ts";
import {
  defaultStoreSettings,
  type StoreSettingsType,
} from "../../utils/types/storeSettingsTypes.ts";

export async function getStoreSettingsService(): Promise<StoreSettingsType> {
  const { data } = await adminApi.get<StoreSettingsType>("/store-settings");
  return { ...defaultStoreSettings, ...data };
}

export async function updateStoreSettingsService(
  settings: StoreSettingsType,
): Promise<StoreSettingsType> {
  const { data } = await adminApi.put<StoreSettingsType>(
    "/store-settings",
    settings,
  );
  return { ...defaultStoreSettings, ...data };
}
