'use client'

import { useState } from 'react'
import CartButton from './CartButton'
import CartDrawer from './CartDrawer'
import StickyCartBar from './StickyCartBar'
import { useAuth } from '@/contexts/AuthContextProvider'

export default function CartWrapper() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { isAdmin } = useAuth()

  if (isAdmin) return null

  return (
    <>
      <CartButton onClick={() => setIsDrawerOpen(true)} />
      <StickyCartBar onClick={() => setIsDrawerOpen(true)} />
      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  )
}
