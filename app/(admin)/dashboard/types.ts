export const DASHBOARD_RANGES = ['7d', '30d', '12m'] as const
export const LOW_STOCK_THRESHOLD = 5
export type DashboardRange = (typeof DASHBOARD_RANGES)[number]
export type DashboardOrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
export type DashboardProductStatus = 'ACTIVE' | 'INACTIVE'

export type DashboardPoint = {
  date: string
  revenue: number
  orders: number
}

export type DashboardOrder = {
  id: string
  customer: string
  itemCount: number
  amount: number
  status: DashboardOrderStatus
  createdAt: string
}

export type DashboardProduct = {
  id: string
  name: string
  image: string | null
  unitsSold: number
  revenue: number
  stock: number
  status: DashboardProductStatus
}

export type SellerDashboardData = {
  role: 'SELLER'
  range: DashboardRange
  storeName: string
  revenueSeries: DashboardPoint[]
  summary: {
    revenue: number
    orders: number
    products: number
    unitsSold: number
    averageOrderValue: number
    rating: number | null
    reviewCount: number
  }
  productStatus: {
    active: number
    inactive: number
    outOfStock: number
  }
  recentOrders: DashboardOrder[]
  topProducts: DashboardProduct[]
  inventoryAttention: Array<{
    id: string
    name: string
    image: string | null
    stock: number
    status: DashboardProductStatus
  }>
}

export type AdminDashboardData = {
  role: 'ADMIN'
  range: DashboardRange
  revenueSeries: DashboardPoint[]
  summary: {
    revenue: number
    orders: number
    customers: number
    sellers: number
    products: number
    activeProducts: number
    averageOrderValue: number
    pendingOrders: number
  }
  orderStatuses: Array<{status: DashboardOrderStatus; count: number}>
  recentOrders: DashboardOrder[]
  topSellers: Array<{
    id: string
    storeName: string
    unitsSold: number
    revenue: number
    orders: number
    activeProducts: number
  }>
  topProducts: DashboardProduct[]
}
