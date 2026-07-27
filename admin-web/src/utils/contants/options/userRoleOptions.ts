import { UserRoleEnum } from "../../enums/UserEnums.ts";

export const USER_ROLE_OPTIONS = [
  { value: UserRoleEnum.ADMIN, label: "Admin" },
  { value: UserRoleEnum.COMPANY, label: "Company" },
  { value: UserRoleEnum.SALES, label: "Sales" },
  { value: UserRoleEnum.STOCK_MANAGER, label: "Stock Manager" },
];
