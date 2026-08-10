import api from "@/src/service/apis/api";
import {
  defaultStoreSettings,
  StoreSettingsType,
} from "@/src/utils/types/storeSettings.type";

export async function getStoreSettingsService(): Promise<StoreSettingsType> {
  try {
    const { data } = await api.get<StoreSettingsType>("/store-settings");
    return { ...defaultStoreSettings, ...data };
  } catch {
    return defaultStoreSettings;
  }
}
