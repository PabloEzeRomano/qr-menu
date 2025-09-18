'use client'

import { CartAction, CartLine, CartState } from '@/types/cart'
import { createContext, useContext, useEffect, useReducer, useCallback } from 'react'

const STORAGE_KEY = 'qrmenu-cart-v1'

const initialState: CartState = {
  lines: [],
  table: null,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existingIndex = state.lines.findIndex((line) => line.id === action.item.id)
      if (existingIndex >= 0) {
        const newLines = [...state.lines]
        newLines[existingIndex] = {
          ...newLines[existingIndex],
          qty: newLines[existingIndex].qty + (action.item.qty || 1),
        }
        return { ...state, lines: newLines }
      }
      return {
        ...state,
        lines: [...state.lines, { ...action.item, qty: action.item.qty || 1 }],
      }
    }
    case 'REMOVE': {
      return {
        ...state,
        lines: state.lines.filter((line) => line.id !== action.id),
      }
    }
    case 'INCREMENT': {
      return {
        ...state,
        lines: state.lines.map((line) =>
          line.id === action.id ? { ...line, qty: line.qty + 1 } : line,
        ),
      }
    }
    case 'DECREMENT': {
      return {
        ...state,
        lines: state.lines
          .map((line) => (line.id === action.id ? { ...line, qty: line.qty - 1 } : line))
          .filter((line) => line.qty > 0),
      }
    }
    case 'SET_QTY': {
      if (action.qty <= 0) {
        return {
          ...state,
          lines: state.lines.filter((line) => line.id !== action.id),
        }
      }
      return {
        ...state,
        lines: state.lines.map((line) =>
          line.id === action.id ? { ...line, qty: action.qty } : line,
        ),
      }
    }
    case 'CLEAR': {
      return { ...state, lines: [] }
    }
    case 'SET_TABLE': {
      return { ...state, table: action.table }
    }
    case 'LOAD_FROM_STORAGE': {
      return action.state
    }
    default:
      return state
  }
}

type CartContextType = {
  state: CartState
  add: (item: Omit<CartLine, 'qty'> & { qty?: number }) => void
  remove: (id: string) => void
  increment: (id: string) => void
  decrement: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
  setTable: (table: string | null) => void
  itemCount: number
  subtotal: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedState = JSON.parse(stored) as CartState
        dispatch({ type: 'LOAD_FROM_STORAGE', state: parsedState })
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
    }
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error)
    }
  }, [state])

  const add = useCallback((item: Omit<CartLine, 'qty'> & { qty?: number }) => {
    dispatch({ type: 'ADD', item })
  }, [])

  const remove = useCallback((id: string) => {
    dispatch({ type: 'REMOVE', id })
  }, [])

  const increment = useCallback((id: string) => {
    dispatch({ type: 'INCREMENT', id })
  }, [])

  const decrement = useCallback((id: string) => {
    dispatch({ type: 'DECREMENT', id })
  }, [])

  const setQty = useCallback((id: string, qty: number) => {
    dispatch({ type: 'SET_QTY', id, qty })
  }, [])

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    dispatch({ type: 'CLEAR' })
  }, [])

  const setTable = useCallback((table: string | null) => {
    dispatch({ type: 'SET_TABLE', table })
  }, [])

  const itemCount = state.lines.reduce((sum, line) => sum + line.qty, 0)
  const subtotal = state.lines.reduce((sum, line) => sum + line.price * line.qty, 0)

  return (
    <CartContext.Provider
      value={{
        state,
        add,
        remove,
        increment,
        decrement,
        setQty,
        clear,
        setTable,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
