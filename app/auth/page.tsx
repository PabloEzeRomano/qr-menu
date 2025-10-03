'use client'

import { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button, Input } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContextProvider'

import { AnimatedBackground } from '../menu/components'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn, signUp, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password, displayName)
      }
      router.push('/')
    } catch (error: any) {
      setError(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="auth-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.45 }}
        className="relative min-h-screen flex items-center justify-center text-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <AnimatedBackground />

        <div className="relative z-10 max-w-md w-full space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-300">
              {isLogin ? 'No tenés una cuenta? ' : 'Ya tenés una cuenta? '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                }}
                className="font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
              >
                {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
              </button>
            </p>
          </motion.div>

          <motion.form
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="displayName"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label
                      htmlFor="displayName"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Nombre de usuario
                    </label>
                    <Input
                      id="displayName"
                      name="displayName"
                      type="text"
                      required={!isLogin}
                      value={displayName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setDisplayName(e.target.value)
                      }
                      className="appearance-none relative block w-full px-4 py-3 bg-black/30 border border-gray-600/50 backdrop-blur-sm placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200"
                      placeholder="Ingresa tu nombre de usuario"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 bg-black/30 border border-gray-600/50 backdrop-blur-sm placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Contraseña
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 bg-black/30 border border-gray-600/50 backdrop-blur-sm placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200"
                  placeholder="Ingresa tu contraseña"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-red-600/20 border border-red-600/40 p-4 backdrop-blur-sm"
              >
                <div className="text-sm text-red-200">{error}</div>
              </motion.div>
            )}

            <Button type="submit" variant="primary" size="md" loading={loading} className="w-full">
              {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
            </Button>

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                href="/"
                className="inline-flex items-center font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Volver al menú
              </Link>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
