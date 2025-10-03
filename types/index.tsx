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
  tagIds?: string[]
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
  showAnimatedBackground?: boolean
  customBackground?: string
  createdAt?: any
  updatedAt?: any
}

export interface OrderItem {
  id: string
  title: string
  quantity: number
  unit_price: number
}

// Re-export onboarding types
export * from './onboarding'

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

export type AdminView =
  | 'overview'
  | 'orders'
  | 'products'
  | 'visibility'
  | 'tags'
  | 'filters'
  | 'invitations'
  | 'settings'


export interface AdminInvitation {
  id: string
  email: string
  createdAt: Date
  expiresAt: Date
  used: boolean
  createdByName: string
}

export interface InvitationResponse {
  message: string
  expiresAt?: string
}

export interface AcceptInviteResponse {
  message: string
  customToken: string
  user: {
    uid: string
    email: string
  }
}

export interface ValidateInviteResponse {
  valid: boolean
  email: string
  expiresAt: string
}
