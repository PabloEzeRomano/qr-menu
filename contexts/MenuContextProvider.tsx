'use client'

import { createContext, ReactNode,useContext, useState } from 'react'

import { MenuItem } from '@/types'

interface MenuContextType {
  // Modal state
  selectedItem: MenuItem | null
  setSelectedItem: (item: MenuItem | null) => void
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void

  // Edit mode state
  isEditMode: boolean
  setIsEditMode: (mode: boolean) => void

  // New items state
  newItems: MenuItem[]
  setNewItems: (items: MenuItem[] | ((prev: MenuItem[]) => MenuItem[])) => void
  addNewItem: (item: MenuItem) => void
  removeNewItem: (itemId: string) => void

  // Loading state
  loadingAnim: boolean
  setLoadingAnim: (loading: boolean) => void
}

const MenuContext = createContext<MenuContextType | null>(null)

export function MenuProvider({ children }: { children: ReactNode }) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [newItems, setNewItems] = useState<MenuItem[]>([])
  const [loadingAnim, setLoadingAnim] = useState(true)

  const addNewItem = (item: MenuItem) => {
    setNewItems((prev) => [...prev, item])
  }

  const removeNewItem = (itemId: string) => {
    setNewItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const value: MenuContextType = {
    selectedItem,
    setSelectedItem,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    setIsEditMode,
    newItems,
    setNewItems,
    addNewItem,
    removeNewItem,
    loadingAnim,
    setLoadingAnim,
  }

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

export function useMenuContext() {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('useMenuContext must be used within a MenuProvider')
  }
  return context
}
