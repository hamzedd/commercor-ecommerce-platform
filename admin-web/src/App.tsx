import { createBrowserRouter, RouterProvider } from "react-router";
import DefaultLayout from "./components/ui/layouts/defaultLayout/DefaultLayout.tsx";
import CategoriesPage from "./pages/categories/page.tsx";
import HomePage from "./pages/page.tsx";
import AddCategoryPage from "./pages/categories/add/page.tsx";
import EditCategoryPage from "./pages/categories/edit/[id]/page.tsx";
import ProductsPage from "./pages/products/page.tsx";
import EditProductPage from "./pages/products/edit/[id]/page.tsx";
import AddProductPage from "./pages/products/add/page.tsx";
import BrandsPage from "./pages/brands/page.tsx";
import EditBrandPage from "./pages/brands/edit/[id]/page.tsx";
import AddBrandPage from "./pages/brands/add/page.tsx";
import CustomersPage from "./pages/customers/page.tsx";
import EditCustomersPage from "./pages/customers/edit/[id]/page.tsx";
import AddCustomersPage from "./pages/customers/add/page.tsx";
import CompanyPage from "./pages/companies/page.tsx";
import EditCompanyPage from "./pages/companies/edit/[id]/page.tsx";
import AddCompanyPage from "./pages/companies/add/page.tsx";
import OrdersPage from "./pages/orders/page.tsx";
import ProductFiltersPage from "./pages/productFilters/page.tsx";
import AddProductFilterPage from "./pages/productFilters/add/page.tsx";
import EditProductFilterPage from "./pages/productFilters/edit/[id]/page.tsx";
import { UserContextProvider } from "./components/contexts/userContext/UserContextProvider.tsx";
import LoginPage from "./pages/login/page.tsx";
import UsersPage from "./pages/users/page.tsx";
import AddUserPage from "./pages/users/add/page.tsx";
import EditUserPage from "./pages/users/edit/[id]/page.tsx";
import NotFoundPage from "./pages/not-found/page.tsx";
import OrderPage from "./pages/orders/[id]/page.tsx";
import SettingsPage from "./pages/settings/page.tsx";
import CommerceSettingsPage from "./pages/commerce-settings/page.tsx";
import LoyaltySettingsPage from "./pages/loyalty-settings/page.tsx";
import CouponsPage from "./pages/coupons/page.tsx";
import ReviewsPage from "./pages/reviews/page.tsx";
import InvoicesPage from "./pages/invoices/page.tsx";
import InventoryPage from "./pages/inventory/page.tsx";
import AbandonedCartsPage from "./pages/abandoned-carts/page.tsx";
import CustomerCrmPage from "./pages/customers/[id]/page.tsx";
import PromotionsPage from "./pages/promotions/page.tsx";
import AnalyticsPage from "./pages/analytics/page.tsx";
import { App as AntApp, ConfigProvider } from "antd";
import { adminTheme } from "./styles/theme.ts";
import AdminNotificationBridge from "./service/apiInstances/AdminNotificationBridge.tsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/admin/login",
      element: <LoginPage />,
    },
    {
      path: "/admin",
      element: (
        <UserContextProvider>
          <DefaultLayout />
        </UserContextProvider>
      ),
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "categories",
          element: <CategoriesPage />,
        },
        {
          path: "categories/add",
          element: <AddCategoryPage />,
        },
        {
          path: "categories/edit/:id",
          element: <EditCategoryPage />,
        },
        {
          path: "customers",
          element: <CustomersPage />,
        },
        { path: "customers/:id", element: <CustomerCrmPage /> },
        {
          path: "customers/add",
          element: <AddCustomersPage />,
        },
        {
          path: "customers/edit/:id",
          element: <EditCustomersPage />,
        },
        {
          path: "companies",
          element: <CompanyPage />,
        },
        {
          path: "companies/add",
          element: <AddCompanyPage />,
        },
        {
          path: "companies/edit/:id",
          element: <EditCompanyPage />,
        },
        {
          path: "products",
          element: <ProductsPage />,
        },
        {
          path: "products/add",
          element: <AddProductPage />,
        },
        {
          path: "products/edit/:id",
          element: <EditProductPage />,
        },
        {
          path: "product-filters",
          element: <ProductFiltersPage />,
        },
        {
          path: "product-filter/add",
          element: <AddProductFilterPage />,
        },
        {
          path: "product-filter/edit/:id",
          element: <EditProductFilterPage />,
        },
        {
          path: "brands",
          element: <BrandsPage />,
        },
        {
          path: "brands/add",
          element: <AddBrandPage />,
        },
        {
          path: "brands/edit/:id",
          element: <EditBrandPage />,
        },
        {
          path: "orders",
          element: <OrdersPage />,
        },
        {
          path: "orders/:id",
          element: <OrderPage />,
        },
        {
          path: "users",
          element: <UsersPage />,
        },
        {
          path: "users/add",
          element: <AddUserPage />,
        },
        {
          path: "users/edit/:id",
          element: <EditUserPage />,
        },
        {
          path: "settings",
          element: <SettingsPage />,
        },
        {
          path: "commerce-settings",
          element: <CommerceSettingsPage />,
        },
        { path: "loyalty-settings", element: <LoyaltySettingsPage /> },
        { path: "coupons", element: <CouponsPage /> },
        { path: "reviews", element: <ReviewsPage /> },
        { path: "invoices", element: <InvoicesPage /> },
        { path: "inventory", element: <InventoryPage /> },
        { path: "abandoned-carts", element: <AbandonedCartsPage /> },
        { path: "promotions", element: <PromotionsPage /> },
        { path: "analytics", element: <AnalyticsPage /> },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return (
    <ConfigProvider theme={adminTheme}>
      <AntApp>
        <AdminNotificationBridge />
        <RouterProvider router={router} />
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
