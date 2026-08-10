"use client";
import { createContext, useContext } from "react";
import {
  defaultStoreSettings,
  StoreSettingsType,
} from "@/src/utils/types/storeSettings.type";

const StoreSettingsContext = createContext(defaultStoreSettings);
export function StoreSettingsProvider({
  settings,
  children,
}: {
  settings: StoreSettingsType;
  children: React.ReactNode;
}) {
  return (
    <StoreSettingsContext.Provider value={settings}>
      {children}
    </StoreSettingsContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export const useStoreSettings = () => useContext(StoreSettingsContext);
