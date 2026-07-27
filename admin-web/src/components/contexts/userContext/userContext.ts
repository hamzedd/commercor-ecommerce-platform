import { createContext, useContext } from "react";
import type { UserType } from "../../../utils/types/userTypes.ts";

export const UserContext = createContext({
  user: {} as UserType,
  setUser: () => {},
  resetUser: () => {},
});

export const useAuth = () => useContext(UserContext);
