'use client'

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { auth, db } from '@/lib/firebase'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  User,
} from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'

type AuthCtx = {
  user: User | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string, type?: 'email' | 'google') => Promise<void>
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  loading: true,
  isAdmin: false,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [authInit, setAuthInit] = useState(true)
  const [roleLoading, setRoleLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  // Helper functions for localStorage admin cache
  const getCachedAdminStatus = (uid: string): boolean | null => {
    try {
      const cached = localStorage.getItem(`admin_${uid}`)
      if (!cached) {
        return null
      }

      const { isAdmin, timestamp } = JSON.parse(cached)
      const now = Date.now()
      const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

      if (now - timestamp > CACHE_DURATION) {
        localStorage.removeItem(`admin_${uid}`)
        return null
      }

      return isAdmin
    } catch (error) {
      return null
    }
  }

  const setCachedAdminStatus = (uid: string, adminStatus: boolean) => {
    try {
      const cacheData = {
        isAdmin: adminStatus,
        timestamp: Date.now(),
      }
      localStorage.setItem(`admin_${uid}`, JSON.stringify(cacheData))
    } catch {
      // Ignore localStorage errors
    }
  }

  // Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setAuthInit(false)

      // If user exists, check if they have cached admin status
      if (user) {
        const cachedStatus = getCachedAdminStatus(user.uid)
        if (cachedStatus !== null) {
          setIsAdmin(cachedStatus)
          setRoleLoading(false)
        }
      }
    })
    return () => unsub()
  }, [])

  // Admin role: admins/{uid}
  useEffect(() => {
    let cancelled = false

    if (!user) {
      setIsAdmin(false)
      setRoleLoading(false)
      return
    }

    // Check cache first for immediate response
    const cachedAdminStatus = getCachedAdminStatus(user.uid)

    if (cachedAdminStatus !== null) {
      setIsAdmin(cachedAdminStatus)
      setRoleLoading(false)
      // Still verify with Firebase in background, but don't show loading
      const ref = doc(db, 'admins', user.uid)
      const unsub = onSnapshot(
        ref,
        (snap) => {
          if (cancelled) return
          const adminStatus = snap.exists()
          // Only update if different from cache
          if (adminStatus !== cachedAdminStatus) {
            setIsAdmin(adminStatus)
            setCachedAdminStatus(user.uid, adminStatus)
          }
        },
        (err) => {
          console.error('onSnapshot(admins) error:', err)
          if (cancelled) return
          // Only update if different from cache
          if (!cachedAdminStatus) {
            setIsAdmin(false)
            setCachedAdminStatus(user.uid, false)
          }
        },
      )
      return () => {
        cancelled = true
        unsub()
      }
    }

    // No cache, show loading and fetch from Firebase
    setRoleLoading(true)
    const ref = doc(db, 'admins', user.uid)

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (cancelled) return
        const adminStatus = snap.exists()
        setIsAdmin(adminStatus)
        setCachedAdminStatus(user.uid, adminStatus)
        setRoleLoading(false)
      },
      (err) => {
        console.error('onSnapshot(admins) error:', err)
        if (cancelled) return
        setIsAdmin(false)
        setCachedAdminStatus(user.uid, false)
        setRoleLoading(false)
      },
    )

    return () => {
      cancelled = true
      unsub()
    }
  }, [user])

  // Sign in (email/google)
  const signIn = useCallback(
    async (email: string, password: string, type: 'email' | 'google' = 'email') => {
      if (type === 'email') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        const provider = new GoogleAuthProvider()
        await signInWithPopup(auth, provider) // crea la cuenta si es primera vez
      }
    },
    [],
  )

  // Sign up (email/password)
  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(cred.user, { displayName })
    }
  }, [])

  const logout = useCallback(async () => {
    // Clear admin cache on logout
    if (user) {
      try {
        localStorage.removeItem(`admin_${user.uid}`)
      } catch {
        // Ignore localStorage errors
      }
    }
    await signOut(auth)
  }, [user])

  const value = useMemo(() => {
    const loading = authInit || roleLoading

    // If we have a user and admin status is confirmed, ensure cache is set
    if (user && !loading && isAdmin) {
      const cachedStatus = getCachedAdminStatus(user.uid)
      if (cachedStatus !== true) {
        setCachedAdminStatus(user.uid, true)
      }
    }

    return {
      user,
      loading,
      isAdmin,
      signIn,
      signUp,
      logout,
    }
  }, [user, authInit, roleLoading, isAdmin, signIn, signUp, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
