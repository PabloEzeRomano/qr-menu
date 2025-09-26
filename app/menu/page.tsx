'use client'

import { AppProvider } from '@/contexts/AppProvider'
import { Suspense } from 'react'
import { LoadingScreen, MenuContent as MenuContentComponent, MenuManager, PaymentStatusHandler } from './components'
import Toast from '@/components/ui/Toast'
import { useErrorHandler } from '@/hooks/useErrorHandler'

function MenuContent() {
  const { error, hideError } = useErrorHandler()

  return (
    <AppProvider>
      <MenuManager>
        <MenuContentComponent />
      </MenuManager>
      <Toast error={error} onClose={hideError} />
    </AppProvider>
  )
}

export default function Menu() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <MenuContent />
      <Suspense fallback={null}>
        <PaymentStatusHandler />
      </Suspense>
    </Suspense>
  )
}
