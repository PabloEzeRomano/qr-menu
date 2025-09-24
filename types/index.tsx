export interface Category {
  key: string
  label: string
  icon: string // emoji o URL
  isVisible: boolean
  createdAt?: any
  updatedAt?: any
}

export type FilterType = 'tag' | 'price_range' | 'category' | 'availability' | 'custom'

export type FilterOperator = 'equals' | 'contains' | 'in' | 'range' | 'exists'

export interface FilterCondition {
  field: string
  operator: FilterOperator
  value: any
}

export interface FilterPredicate {
  conditions: FilterCondition[]
  logic: 'AND' | 'OR'
}

export interface Filter {
  id: string
  key: string
  label: string
  description?: string
  icon?: string
  type: FilterType
  predicate: FilterPredicate
  isActive: boolean
  order: number
  color?: string
  createdAt?: any
  updatedAt?: any
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  tagIds?: string[] // Store tag IDs instead of hardcoded values (optional for migration)
  img: string
  isVisible: boolean
  createdAt?: any
  updatedAt?: any
}

export interface DailyMenu {
  title: string
  hours: string
  price: number
  items: string[]
  isVisible: boolean
  createdAt?: any
  updatedAt?: any
}

export interface Restaurant {
  name: string
  description: string
  address: string
  phone: string
  email: string
  website: string
  hasCart: boolean
  createdAt?: any
  updatedAt?: any
}

export interface OrderItem {
  id: string
  title: string
  quantity: number
  unit_price: number
}

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  table: string | null
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  paymentId?: number
  paymentRaw?: any
  createdAt?: any
  updatedAt?: any
}

export interface Tag {
  id: string
  key: string
  label: string
  color: string
  category: 'diet' | 'feature' | 'custom'
  isActive: boolean
  order: number
  createdAt?: any
  updatedAt?: any
}

export type AdminView = 'overview' | 'orders' | 'products' | 'visibility' | 'tags' | 'filters'
