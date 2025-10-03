'use client'

import { useState } from 'react'

import { AnimatePresence,motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useAuth } from '@/contexts/AuthContextProvider'

import Button from './ui/Button'

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout, isAdmin } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/20 shadow-lg"
    >
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🍽️</span>
              <span className="font-bold text-white text-xl">QR Menu</span>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <Button variant={pathname === '/' ? 'nav-active' : 'nav'} size="sm">
                Inicio
              </Button>
            </Link>
            <Link href="/menu">
              <Button variant={pathname === '/menu' ? 'nav-active' : 'nav'} size="sm">
                Menú
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <Button variant={pathname === '/admin' ? 'nav-active' : 'nav'} size="sm">
                  Admin
                </Button>
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <Button onClick={logout} variant="danger" size="sm">
                    Cerrar sesión
                  </Button>
                </div>
              </div>
            ) : (
              <Link href="/auth">
                <Button variant="primary" size="sm">
                  Iniciar sesión
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/20 pt-4 pb-2"
            >
              <div className="space-x-1 space-y-1">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant={pathname === '/' ? 'nav-active' : 'nav'}
                    size="sm"
                    className="w-full justify-start"
                  >
                    Inicio
                  </Button>
                </Link>
                <Link href="/menu" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant={pathname === '/menu' ? 'nav-active' : 'nav'}
                    size="sm"
                    className="w-full justify-start"
                  >
                    Menú
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant={pathname === '/admin' ? 'nav-active' : 'nav'}
                      size="sm"
                      className="w-full justify-start"
                    >
                      Admin
                    </Button>
                  </Link>
                )}
                {user ? (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <Button
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                      variant="danger"
                      size="sm"
                      className="w-full"
                    >
                      Cerrar sesión
                    </Button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-white/10">
                    <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="primary" size="sm" className="w-full">
                        Iniciar sesión
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
