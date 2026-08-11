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

export type DashboardType = {
  totalOrders: number;
  pendingOrders: number;
  lowStockProducts: number;
  revenueThisWeek: number;
  recentOrders: DashboardOrderType[];
};
