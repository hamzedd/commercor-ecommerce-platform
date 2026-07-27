import type { UserRoleEnum } from "../enums/UserEnums.ts";

export type UserType = {
  id: string;
  username: string;
  email: string;
  role: UserRoleEnum;
};

export type UserCreateType = {
  username: string;
  password: string;
  email: string;
  role: UserRoleEnum;
};
