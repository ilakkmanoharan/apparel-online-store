export interface AdminUser {
  uid: string;
  email: string;
  role: "admin" | "super_admin" | "support";
  createdAt: Date;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
  period: "day" | "week" | "month";
  periodStart: Date;
  periodEnd: Date;
}

export interface ReportFilter {
  startDate: Date;
  endDate: Date;
  categoryId?: string;
  status?: string;
}

export interface TopProductRow {
  productId: string;
  name: string;
  quantitySold: number;
  revenue: number;
}

export interface OrderStatsRow {
  date: string;
  orders: number;
  revenue: number;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  resource: string;
  resourceId?: string;
  userId: string;
  userEmail?: string;
  details?: Record<string, unknown>;
  createdAt: Date;
}
