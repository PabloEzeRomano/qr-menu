'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useAuth } from '@/contexts/AuthContextProvider'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  fallback?: React.ReactNode
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  fallback,
}: ProtectedRouteProps) {
  const { user, isAdmin, isRoot, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Add a small delay to allow cache to load
    const timeoutId = setTimeout(() => {
      // Only redirect if we're not loading AND we have definitive information
      if (!loading) {
        if (!user) {
          router.push('/auth')
          return
        }

        // For admin routes, only redirect if we're sure the user is not an admin
        // This prevents redirecting during the brief moment when admin status is being verified
        if (requireAdmin && !isAdmin && !isRoot) {
          router.push('/')
          return
        }
      }
    }, 100) // Small delay to allow cache to load

    return () => clearTimeout(timeoutId)
  }, [user, isAdmin, isRoot, loading, requireAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please sign in to access this page.</p>
            <button
              onClick={() => router.push('/auth')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Sign In
            </button>
          </div>
        </div>
      )
    )
  }

  if (requireAdmin && !isAdmin && !isRoot) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h2>
            <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
            <button
              onClick={() => router.push('/')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Go Home
            </button>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}
