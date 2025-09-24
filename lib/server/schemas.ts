import { z } from 'zod'

export const MenuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(''),
  price: z.number().nonnegative(),
  category: z.string().min(1),
  tagIds: z.array(z.string()).optional().default([]),
  img: z.url().or(z.literal('')).default(''),
  isVisible: z.boolean().default(true),
})

export const CategorySchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  icon: z.string().min(1), // emoji o URL
  isVisible: z.boolean().default(true),
})

export const DailyMenuSchema = z.object({
  title: z.string().min(1),
  hours: z.string().min(1),
  price: z.number().nonnegative(),
  items: z.array(z.string()).default([]),
  isVisible: z.boolean().default(true),
})

export const RestaurantSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(''),
  address: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.email().optional(),
  website: z.url().optional(),
  hasCart: z.boolean().default(true),
})

export const FilterConditionSchema = z.object({
  field: z.string().min(1),
  operator: z.enum(['equals', 'contains', 'in', 'range', 'exists']),
  value: z.any(),
})

export const FilterPredicateSchema = z.object({
  conditions: z.array(FilterConditionSchema).min(0), // Allow empty conditions for "all" filter
  logic: z.enum(['AND', 'OR']).default('AND'),
})

export const FilterSchema = z.object({
  id: z.string().min(1),
  key: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
  type: z.enum(['tag', 'price_range', 'category', 'availability', 'custom']),
  predicate: FilterPredicateSchema,
  isActive: z.boolean().default(true),
  order: z.number().int().min(0),
  color: z.string().optional(),
})

export const TagSchema = z.object({
  id: z.string().min(1),
  key: z.string().min(1),
  label: z.string().min(1),
  color: z.string().min(1),
  category: z.enum(['diet', 'feature', 'custom']),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0),
})
