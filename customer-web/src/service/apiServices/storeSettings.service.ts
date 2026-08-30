import fetchApi from "@/src/service/apis/fetchApi";
import {
  defaultStoreSettings,
  StoreSettingsType,
} from "@/src/utils/types/storeSettings.type";

export async function getStoreSettingsService(): Promise<StoreSettingsType> {
  try {
    const data = await fetchApi<StoreSettingsType>("/store-settings", {
      next: {
        revalidate: 60 * 5, // Revalidate every 5 minutes
        tags: ["store-settings"],
      },
    });
    return { ...defaultStoreSettings, ...data };
  } catch {
    return defaultStoreSettings;
  }
}
