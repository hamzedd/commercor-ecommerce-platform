import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  SettingOutlined,
  DollarOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { UserRoleEnum } from "../../../../../utils/enums/UserEnums.ts";

export default [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard",
    path: "/admin",
    roles: [UserRoleEnum.ADMIN],
  },
  {
    key: "customers",
    icon: <UserOutlined />,
    label: "Customers",
    path: "/admin/customers",
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.COMPANY],
  },
  {
    key: "company",
    icon: <VideoCameraOutlined />,
    label: "Company",
    path: "/admin/companies",
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.COMPANY],
  },
  {
    key: "categories",
    icon: <UploadOutlined />,
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
    icon: <UploadOutlined />,
    label: "Brands",
    path: "/admin/brands",
    roles: [
      UserRoleEnum.ADMIN,
      UserRoleEnum.COMPANY,
      UserRoleEnum.STOCK_MANAGER,
    ],
  },
  {
    key: "products",
    icon: <UploadOutlined />,
    label: "Products",
    path: "/admin/products",
    roles: [
      UserRoleEnum.ADMIN,
      UserRoleEnum.COMPANY,
      UserRoleEnum.STOCK_MANAGER,
    ],
  },
  {
    key: "product-filters",
    icon: <UploadOutlined />,
    label: "Product Filters",
    path: "/admin/product-filters",
    roles: [
      UserRoleEnum.ADMIN,
      UserRoleEnum.COMPANY,
      UserRoleEnum.STOCK_MANAGER,
    ],
  },
  {
    key: "orders",
    icon: <UploadOutlined />,
    label: "Orders",
    path: "/admin/orders",
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.SALES, UserRoleEnum.COMPANY],
  },
  {
    key: "users",
    icon: <UploadOutlined />,
    label: "Users",
    path: "/admin/users",
    roles: [UserRoleEnum.ADMIN],
  },
  {
    key: "commerce-settings",
    icon: <DollarOutlined />,
    label: "Shipping & Tax",
    path: "/admin/commerce-settings",
    roles: [UserRoleEnum.ADMIN],
  },
  { key: "loyalty-settings", icon: <DollarOutlined />, label: "Loyalty & Cashback", path: "/admin/loyalty-settings", roles: [UserRoleEnum.ADMIN] },
  { key: "coupons", icon: <DollarOutlined />, label: "Coupons", path: "/admin/coupons", roles: [UserRoleEnum.ADMIN] },
  { key: "reviews", icon: <UploadOutlined />, label: "Reviews", path: "/admin/reviews", roles: [UserRoleEnum.ADMIN] },
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Store Settings",
    path: "/admin/settings",
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.COMPANY],
  },
];
