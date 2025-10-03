'use client'

import { Suspense } from 'react'

import Toast from '@/components/ui/Toast'
import { AppProvider } from '@/contexts/AppProvider'
import { useErrorHandler } from '@/hooks/useErrorHandler'

import {
  LoadingScreen,
  MenuContent as MenuContentComponent,
  MenuManager,
  PaymentStatusHandler,
} from './components'

function MenuContent() {
  const { error, hideToast } = useErrorHandler()

  return (
    <AppProvider>
      <MenuManager>
        <MenuContentComponent />
      </MenuManager>
      <Toast error={error} onClose={hideToast} />
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
