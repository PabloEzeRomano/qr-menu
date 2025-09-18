export type CartLine = {
  id: string
  name: string
  price: number
  img?: string | null
  qty: number
}

export type CartState = {
  lines: CartLine[]
  table?: string | null
}

export type CartAction =
  | { type: 'ADD'; item: Omit<CartLine, 'qty'> & { qty?: number } }
  | { type: 'REMOVE'; id: string }
  | { type: 'INCREMENT'; id: string }
  | { type: 'DECREMENT'; id: string }
  | { type: 'SET_QTY'; id: string; qty: number }
  | { type: 'CLEAR' }
  | { type: 'SET_TABLE'; table: string | null }
  | { type: 'LOAD_FROM_STORAGE'; state: CartState }
