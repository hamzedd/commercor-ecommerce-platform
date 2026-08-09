import {
  AppstoreOutlined,
  BankOutlined,
  FilterOutlined,
  HomeOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";
import { UserRoleEnum } from "../../../../../utils/enums/UserEnums.ts";

export type AdminNavigationItem = {
  key: string;
  icon: ReactNode;
  label: string;
  path: string;
  roles: UserRoleEnum[];
};

const defaultLayoutLinksList: AdminNavigationItem[] = [
  {
    key: "dashboard",
    icon: <HomeOutlined />,
    label: "Dashboard",
    path: "/admin",
    roles: Object.values(UserRoleEnum),
  },
  {
    key: "orders",
    icon: <ShoppingCartOutlined />,
    label: "Orders",
    path: "/admin/orders",
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.SALES, UserRoleEnum.COMPANY],
  },
  {
    key: "products",
    icon: <InboxOutlined />,
    label: "Products",
    path: "/admin/products",
    roles: [
      UserRoleEnum.ADMIN,
      UserRoleEnum.COMPANY,
      UserRoleEnum.STOCK_MANAGER,
    ],
  },
  {
    key: "categories",
    icon: <AppstoreOutlined />,
    label: "Categories",
    path: "/admin/categories",
    roles: [
      UserRoleEnum.ADMIN,
      UserRoleEnum.COMPANY,
      UserRoleEnum.STOCK_MANAGER,
    ],
  },
  {
    key: "brands",
    icon: <TagsOutlined />,
    label: "Brands",
    path: "/admin/brands",
    roles: [
      UserRoleEnum.ADMIN,
      UserRoleEnum.COMPANY,
      UserRoleEnum.STOCK_MANAGER,
    ],
  },
  {
    key: "product-filters",
    icon: <FilterOutlined />,
    label: "Product filters",
    path: "/admin/product-filters",
    roles: [
      UserRoleEnum.ADMIN,
      UserRoleEnum.COMPANY,
      UserRoleEnum.STOCK_MANAGER,
    ],
  },
  {
    key: "customers",
    icon: <TeamOutlined />,
    label: "Customers",
    path: "/admin/customers",
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.COMPANY],
  },
  {
    key: "company",
    icon: <BankOutlined />,
    label: "Companies",
    path: "/admin/companies",
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.COMPANY],
  },
  {
    key: "users",
    icon: <UsergroupAddOutlined />,
    label: "Admin users",
    path: "/admin/users",
    roles: [UserRoleEnum.ADMIN],
  },
];

export default defaultLayoutLinksList;
