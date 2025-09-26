'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import Button from './ui/Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-red-400">Algo salió mal</h1>
              <p className="text-gray-300">Ha ocurrido un error inesperado</p>
              <Button onClick={() => window.location.reload()} variant="primary" size="md">
                Recargar página
              </Button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
