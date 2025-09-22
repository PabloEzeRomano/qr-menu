'use client'

import { AppProvider } from '@/contexts/AppProvider'
import { Suspense } from 'react'
import { LoadingScreen, MenuContent, MenuManager, PaymentStatusHandler } from './components'
import Toast from '@/components/Toast'
import { useErrorHandler } from '@/hooks/useErrorHandler'

function DemoMenuContent() {
  const { error, hideError } = useErrorHandler()

  return (
    <AppProvider>
      <MenuManager>
        <MenuContent />
      </MenuManager>
      <Toast error={error} onClose={hideError} />
    </AppProvider>
  )
}

export default function DemoMenu() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <DemoMenuContent />
      <Suspense fallback={null}>
        <PaymentStatusHandler />
      </Suspense>
    </Suspense>
  )
}
