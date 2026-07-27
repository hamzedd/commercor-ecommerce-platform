import React, { useEffect, useMemo, useState } from "react";
import { UserContext } from "./userContext.ts";
import { getProfileService } from "../../../service/apiServices/authServices.ts";

const STORAGE_KEY = "accessToken";

export function UserContextProvider(props: {
  children: React.ReactNode;
}): React.ReactElement {
  const { children } = props;
  const [userData, setUserData] = useState({});

  const setUser = ({ user, token }: { user?: any; token?: any }) => {
    if (Boolean(user) && typeof user === "object") {
      setUserData(user);
    }
    if (Boolean(token) && typeof token === "string") {
      localStorage.setItem(STORAGE_KEY, token);
    }
  };

  const resetUser = (): void => {
    setUserData({});
    localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const res = await getProfileService();
      setUser({ user: res });
    };
    fetchUserProfile();
  }, []);

  const contextValue = useMemo(
    () => ({
      user: userData,
      setUser,
      resetUser,
    }),
    [userData],
  );

  return (
    <UserContext.Provider value={contextValue as any}>
      {children}
    </UserContext.Provider>
  );
}
