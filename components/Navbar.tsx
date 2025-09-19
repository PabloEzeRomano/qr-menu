'use client'

import Button from './Button'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContextProvider'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
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
              <Button
                variant={pathname === '/' ? 'nav-active' : 'nav'}
                size="sm"
              >
                Inicio
              </Button>
            </Link>
            <Link href="/demo-menu">
              <Button
                variant={pathname === '/demo-menu' ? 'nav-active' : 'nav'}
                size="sm"
              >
                Demo
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {/* {isAdmin && (
                  <Link
                    href="/admin"
                    className={`px-3 py-2 rounded-md transition-colors ${
                      pathname === '/admin'
                        ? 'bg-cyan-500/80 text-white font-medium'
                        : 'text-cyan-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Admin
                  </Link>
                )} */}
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300 text-sm hidden sm:block">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
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
              <div className="space-y-2">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant={pathname === '/' ? 'nav-active' : 'nav'}
                    size="sm"
                    className="w-full justify-start"
                  >
                    Inicio
                  </Button>
                </Link>
                <Link href="/demo-menu" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant={pathname === '/demo-menu' ? 'nav-active' : 'nav'}
                    size="sm"
                    className="w-full justify-start"
                  >
                    Demo
                  </Button>
                </Link>

                {user ? (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="px-4 py-2">
                      <span className="text-gray-300 text-sm">
                        {user.displayName || user.email?.split('@')[0]}
                      </span>
                    </div>
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
