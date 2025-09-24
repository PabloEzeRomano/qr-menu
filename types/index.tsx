export interface Category {
  key: string
  label: string
  icon: string // emoji o URL
  isVisible: boolean
  createdAt?: any
  updatedAt?: any
}

export type Predicate = { tag?: string; diet?: string }
export interface Filter {
  key: string
  label: string
  icon?: string
  predicate?: Predicate
  createdAt?: any
  updatedAt?: any
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  tags: string[]
  diet: string[]
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

export type AdminView = 'overview' | 'orders' | 'products' | 'visibility' | 'tags'
