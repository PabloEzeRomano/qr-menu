// Error Messages
export const ERROR_MESSAGES = {
  CATEGORY_CREATE: 'Error creando la categoría',
  CATEGORY_UPDATE: 'Error actualizando la categoría',
  CATEGORY_DELETE: 'No se pudo borrar la categoría (puede tener ítems)',
  ITEM_CREATE: 'Error creando el plato',
  ITEM_UPDATE: 'Error guardando el plato',
  ITEM_DELETE: 'Error eliminando el plato',
  ITEM_NEW: 'Error creando nuevo item',
  RESTAURANT_TITLE: 'Error actualizando el título',
  RESTAURANT_SUBTITLE: 'Error actualizando la descripción',
  DAILY_MENU_SAVE: 'Error guardando el Menú del día',
  IMAGE_UPLOAD: 'Error subiendo la imagen',
} as const

// Default Values
export const DEFAULT_VALUES = {
  RESTAURANT_NAME: '🍽️ Restaurant Name',
  RESTAURANT_DESCRIPTION: 'Menú digital · Actualizado al instante',
  DAILY_MENU_TITLE: 'Menú del día',
  DAILY_MENU_HOURS: '12:00–15:00',
  DAILY_MENU_PRICE: 0,
  NEW_ITEM_NAME: 'Nuevo plato',
  NEW_ITEM_DESCRIPTION: 'Descripción del nuevo plato',
  NEW_ITEM_PRICE: 0,
  PLACEHOLDER_IMAGE:
    'https://vuzhpuvkkrtyiw2d.public.blob.vercel-storage.com/items/placeholder.png',
} as const

// UI Constants
export const UI_CONSTANTS = {
  TOAST_AUTO_HIDE_DELAY: 5000,
  ANIMATION_DURATION: 0.45,
  DEBOUNCE_DELAY: 300,
} as const

// Storage Keys
export const STORAGE_KEYS = {
  CART: 'qrmenu-cart-v1',
} as const

// Temp ID Prefix
export const TEMP_ID_PREFIX = 'temp-'
