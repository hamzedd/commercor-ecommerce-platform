import { createBrowserRouter, RouterProvider } from "react-router";
import { lazy, Suspense } from "react";
import DefaultLayout from "./components/ui/layouts/defaultLayout/DefaultLayout.tsx";
import { UserContextProvider } from "./components/contexts/userContext/UserContextProvider.tsx";
import LoginPage from "./pages/login/page.tsx";
import { App as AntApp, ConfigProvider } from "antd";
import { Skeleton } from "antd";
import { adminTheme } from "./styles/theme.ts";
import AdminNotificationBridge from "./service/apiInstances/AdminNotificationBridge.tsx";
import RouteErrorBoundary from "./components/ui/errorBoundary/RouteErrorBoundary.tsx";

const HomePage = lazy(() => import("./pages/page.tsx"));
const CategoriesPage = lazy(() => import("./pages/categories/page.tsx"));
const AddCategoryPage = lazy(() => import("./pages/categories/add/page.tsx"));
const EditCategoryPage = lazy(
  () => import("./pages/categories/edit/[id]/page.tsx"),
);
const ProductsPage = lazy(() => import("./pages/products/page.tsx"));
const EditProductPage = lazy(
  () => import("./pages/products/edit/[id]/page.tsx"),
);
const AddProductPage = lazy(() => import("./pages/products/add/page.tsx"));
const BrandsPage = lazy(() => import("./pages/brands/page.tsx"));
const EditBrandPage = lazy(() => import("./pages/brands/edit/[id]/page.tsx"));
const AddBrandPage = lazy(() => import("./pages/brands/add/page.tsx"));
const CustomersPage = lazy(() => import("./pages/customers/page.tsx"));
const CustomerCrmPage = lazy(() => import("./pages/customers/[id]/page.tsx"));
const EditCustomersPage = lazy(
  () => import("./pages/customers/edit/[id]/page.tsx"),
);
const AddCustomersPage = lazy(() => import("./pages/customers/add/page.tsx"));
const CompanyPage = lazy(() => import("./pages/companies/page.tsx"));
const EditCompanyPage = lazy(
  () => import("./pages/companies/edit/[id]/page.tsx"),
);
const AddCompanyPage = lazy(() => import("./pages/companies/add/page.tsx"));
const OrdersPage = lazy(() => import("./pages/orders/page.tsx"));
const OrderPage = lazy(() => import("./pages/orders/[id]/page.tsx"));
const ProductFiltersPage = lazy(
  () => import("./pages/productFilters/page.tsx"),
);
const AddProductFilterPage = lazy(
  () => import("./pages/productFilters/add/page.tsx"),
);
const EditProductFilterPage = lazy(
  () => import("./pages/productFilters/edit/[id]/page.tsx"),
);
const UsersPage = lazy(() => import("./pages/users/page.tsx"));
const AddUserPage = lazy(() => import("./pages/users/add/page.tsx"));
const EditUserPage = lazy(() => import("./pages/users/edit/[id]/page.tsx"));
const SettingsPage = lazy(() => import("./pages/settings/page.tsx"));
const CommerceSettingsPage = lazy(
  () => import("./pages/commerce-settings/page.tsx"),
);
const LoyaltySettingsPage = lazy(
  () => import("./pages/loyalty-settings/page.tsx"),
);
const CouponsPage = lazy(() => import("./pages/coupons/page.tsx"));
const ReviewsPage = lazy(() => import("./pages/reviews/page.tsx"));
const InvoicesPage = lazy(() => import("./pages/invoices/page.tsx"));
const InventoryPage = lazy(() => import("./pages/inventory/page.tsx"));
const AbandonedCartsPage = lazy(
  () => import("./pages/abandoned-carts/page.tsx"),
);
const PromotionsPage = lazy(() => import("./pages/promotions/page.tsx"));
const AnalyticsPage = lazy(() => import("./pages/analytics/page.tsx"));
const NotFoundPage = lazy(() => import("./pages/not-found/page.tsx"));

function RouteLoading() {
  return (
    <div className="w-full rounded-2xl bg-white p-6" aria-label="Loading page">
      <Skeleton active paragraph={{ rows: 7 }} />
    </div>
  );
}

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
          errorElement: <RouteErrorBoundary />,
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
        <Suspense fallback={<RouteLoading />}>
          <RouterProvider router={router} />
        </Suspense>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
