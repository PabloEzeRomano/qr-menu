'use client'

import { createContext, useCallback,useContext, useEffect, useMemo, useState } from 'react'

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'

import { auth, db } from '@/lib/firebase'

type AuthCtx = {
  user: User | null
  loading: boolean
  isAdmin: boolean
  isRoot: boolean
  signIn: (email: string, password: string, type?: 'email' | 'google') => Promise<void>
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  loading: true,
  isAdmin: false,
  isRoot: false,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [authInit, setAuthInit] = useState(true)
  const [roleLoading, setRoleLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isRoot, setIsRoot] = useState(false)

  // Helper functions for localStorage admin cache
  const getCachedAdminStatus = (uid: string): { isAdmin: boolean; isRoot: boolean } | null => {
    try {
      const cached = localStorage.getItem(`admin_${uid}`)
      if (!cached) {
        return null
      }

      const parsed = JSON.parse(cached)
      const now = Date.now()
      const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

      if (now - parsed.timestamp > CACHE_DURATION) {
        localStorage.removeItem(`admin_${uid}`)
        return null
      }

      // Handle migration from old cache format
      const isAdmin = parsed.isAdmin || false
      const isRoot = parsed.isRoot || false

      return { isAdmin, isRoot }
    } catch (error) {
      return null
    }
  }

  const setCachedAdminStatus = (uid: string, adminStatus: boolean, rootStatus: boolean) => {
    try {
      const cacheData = {
        isAdmin: adminStatus,
        isRoot: rootStatus,
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
          setIsAdmin(cachedStatus.isAdmin)
          setIsRoot(cachedStatus.isRoot)
          setRoleLoading(false)
        }
      }
    })
    return () => unsub()
  }, [])

  // Admin/Root role: users/{uid} with role 'admin' or 'root'
  useEffect(() => {
    let cancelled = false

    if (!user) {
      setIsAdmin(false)
      setIsRoot(false)
      setRoleLoading(false)
      return
    }

    // Check cache first for immediate response
    const cachedAdminStatus = getCachedAdminStatus(user.uid)

    if (cachedAdminStatus !== null) {
      setIsAdmin(cachedAdminStatus.isAdmin)
      setIsRoot(cachedAdminStatus.isRoot)
      setRoleLoading(false)
      // Still verify with Firebase in background, but don't show loading
      const userRef = doc(db, 'users', user.uid)

      const unsubUser = onSnapshot(
        userRef,
        (snap) => {
          if (cancelled) return
          const userData = snap.data()
          const isAdmin = userData?.role === 'admin'
          const isRoot = userData?.role === 'root'
          // Only update if different from cache
          if (isAdmin !== cachedAdminStatus.isAdmin || isRoot !== cachedAdminStatus.isRoot) {
            setIsAdmin(isAdmin)
            setIsRoot(isRoot)
            setCachedAdminStatus(user.uid, isAdmin, isRoot)
          }
        },
        (err) => {
          console.error('onSnapshot(users) error:', err)
        }
      )

      return () => {
        cancelled = true
        unsubUser()
      }
    }

    // No cache, show loading and fetch from Firebase
    setRoleLoading(true)
    const userRef = doc(db, 'users', user.uid)

    let resolved = false

    const checkStatus = (userData: any) => {
      if (resolved) return
      resolved = true
      const isAdmin = userData?.role === 'admin'
      const isRoot = userData?.role === 'root'
      setIsAdmin(isAdmin)
      setIsRoot(isRoot)
      setCachedAdminStatus(user.uid, isAdmin, isRoot)
      setRoleLoading(false)
    }

    const unsubUser = onSnapshot(
      userRef,
      (snap) => {
        if (cancelled) return
        const userData = snap.data()
        checkStatus(userData)
      },
      (err) => {
        console.error('onSnapshot(users) error:', err)
        if (cancelled) return
        checkStatus(null)
      }
    )

    return () => {
      cancelled = true
      unsubUser()
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
      if (cachedStatus?.isAdmin !== true) {
        setCachedAdminStatus(user.uid, isAdmin, isRoot)
      }
    }

    return {
      user,
      loading,
      isAdmin,
      isRoot,
      signIn,
      signUp,
      logout,
    }
  }, [user, authInit, roleLoading, isAdmin, isRoot, signIn, signUp, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
