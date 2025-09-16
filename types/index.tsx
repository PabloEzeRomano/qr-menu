export interface Category {
  key: string
  label: string
  icon: string // emoji o URL
  createdAt?: any
  updatedAt?: any
}

export interface Filter {
  key: string
  label: string
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
