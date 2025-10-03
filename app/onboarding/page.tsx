'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import ProtectedRoute from '@/components/ProtectedRoute'
import { AppProvider } from '@/contexts/AppProvider'
import { OnboardingProvider, useOnboarding } from '@/contexts/OnboardingProvider'

import OnboardingFlow from './components/OnboardingFlow'

function OnboardingContent() {
  const { isCompleted } = useOnboarding()
  const router = useRouter()

  useEffect(() => {
    if (isCompleted) {
      router.push('/admin')
    }
  }, [isCompleted, router])

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return <OnboardingFlow />
}

export default function OnboardingPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AppProvider>
        <OnboardingProvider>
          <OnboardingContent />
        </OnboardingProvider>
      </AppProvider>
    </ProtectedRoute>
  )
}
