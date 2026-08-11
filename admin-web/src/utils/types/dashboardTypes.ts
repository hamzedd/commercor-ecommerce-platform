export type DashboardOrderType = {
  id: string;
  reference: string;
  customerName: string | null;
  customerEmail: string | null;
  itemCount: number;
  status: string;
  createdAt: string;
  totalAmount: number;
};

export type WeeklyRevenueType = {
  day: string;
  date: string;
  revenue: number;
};

export type OrderStatusBreakdownType = {
  status: string;
  count: number;
};

export type TopSellingProductType = {
  productId: string;
  name: string;
  quantitySold: number;
  revenue: number;
  image?: string;
};

export type DashboardType = {
  totalOrders: number;
  pendingOrders: number;
  lowStockProducts: number;
  revenueThisWeek: number;
  recentOrders: DashboardOrderType[];
  weeklyRevenue: WeeklyRevenueType[];
  orderStatusBreakdown: OrderStatusBreakdownType[];
  topSellingProducts: TopSellingProductType[];
};
