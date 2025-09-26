import { apiJson } from '../apiClient'

// Cart/Payment CRUD
export const cartPayment = async (cart: Array<{ id: string; qty: number }>) =>
  apiJson<{ orderId: string; id: string; init_point: string; sandbox_init_point: string }>(
    '/api/mp/preference',
    'POST',
    { cart },
  )
