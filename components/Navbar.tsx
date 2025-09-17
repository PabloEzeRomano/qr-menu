'use client'

import Button from './Button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContextProvider'

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

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

          <div className="flex items-center space-x-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  pathname === '/'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                Inicio
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/demo-menu"
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  pathname === '/demo-menu'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                Demo
              </Link>
            </motion.div>

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
        </div>
      </div>
    </motion.nav>
  )
}
