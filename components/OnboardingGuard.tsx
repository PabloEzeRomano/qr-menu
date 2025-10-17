'use client'

import { useCallback, useEffect, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import { useAuth } from '@/contexts/AuthContextProvider'
import { getOnboardingStatus } from '@/lib/api/restaurant'

interface OnboardingGuardProps {
  children: React.ReactNode
}

export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { user, isAdmin, isRoot, loading } = useAuth()
  const router = useRouter()
  const [onboardingChecked, setOnboardingChecked] = useState(false)

  const checkOnboarding = useCallback(async () => {
    // Skip check if not authenticated, not admin, or still loading
    if (!user || loading || !isAdmin || isRoot) {
      setOnboardingChecked(true)
      return
    }

    try {
      const response = await getOnboardingStatus()

      if (!response.completed) {
        router.push('/onboarding')
        return
      }
    } catch (error) {
      console.error('OnboardingGuard: Error checking onboarding status:', error)
      // If error, assume not completed and redirect to onboarding
      router.push('/onboarding')
      return
    } finally {
      setOnboardingChecked(true)
    }
  }, [user, loading, isAdmin, isRoot, router])

  // Check onboarding on initial load and whenever pathname, user, or admin status changes
  useEffect(() => {
    checkOnboarding()
  }, [checkOnboarding])

  // Show loading while checking onboarding status
  if (!onboardingChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return <>{children}</>
}
