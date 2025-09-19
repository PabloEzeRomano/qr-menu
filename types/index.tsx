export interface Category {
  key: string
  label: string
  icon: string // emoji o URL
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
  createdAt?: any
  updatedAt?: any
}
