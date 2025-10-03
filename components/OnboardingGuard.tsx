'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useAuth } from '@/contexts/AuthContextProvider'
import { getOnboardingStatus } from '@/lib/api/restaurant'

interface OnboardingGuardProps {
  children: React.ReactNode
}

export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const [onboardingChecked, setOnboardingChecked] = useState(false)

  useEffect(() => {
    const checkOnboarding = async () => {
      // Skip check if not authenticated, not admin, or still loading
      if (!user || loading || !isAdmin) {
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
        console.error('Error checking onboarding status:', error)
        // If error, assume not completed and redirect to onboarding
        router.push('/onboarding')
        return
      } finally {
        setOnboardingChecked(true)
      }
    }

    checkOnboarding()
  }, [user, loading, isAdmin, router])

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
