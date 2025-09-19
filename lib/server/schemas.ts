import { z } from 'zod'

export const MenuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(''),
  price: z.number().nonnegative(),
  category: z.string().min(1),
  tags: z.array(z.enum(['nuevo', 'recomendado'])).default([]),
  diet: z.array(z.enum(['vegetariano', 'vegano', 'sin-gluten'])).default([]),
  img: z.url().or(z.literal('')).default(''),
  isVisible: z.boolean().default(true),
})

export const CategorySchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  icon: z.string().min(1), // emoji o URL
})

export const DailyMenuSchema = z.object({
  title: z.string().min(1),
  hours: z.string().min(1),
  price: z.number().nonnegative(),
  items: z.array(z.string()).default([]),
})

export const RestaurantSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(''),
  address: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.email().optional(),
  website: z.url().optional(),
})

export const FilterSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  icon: z.string().optional(),
  predicate: z.object({ tag: z.string().optional(), diet: z.string().optional() }).optional(),
})
