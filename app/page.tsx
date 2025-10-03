'use client'

import { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui'

import { AnimatedBackground } from './menu/components'

const phrases = [
  'Decile chau al menú en PDF',
  'Mostrá tu carta con estilo',
  'Tu menú, rápido y siempre actualizado',
]

export default function Landing() {
  const router = useRouter()
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    let timeout: NodeJS.Timeout
    let index = 0
    const fullText = phrases[currentPhrase]

    const type = () => {
      setDisplayedText(fullText.slice(0, index++))
      if (index <= fullText.length) {
        timeout = setTimeout(type, 60)
      } else {
        setTimeout(() => {
          setCurrentPhrase((prev) => (prev + 1) % phrases.length)
        }, 2000)
      }
    }

    type()
    return () => clearTimeout(timeout)
  }, [currentPhrase])

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key="landing-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.45 }}
        className="relative min-h-screen text-white flex flex-col items-center justify-center px-6 pt-24 pb-20 overflow-hidden"
      >
        <AnimatedBackground />

        <div className="relative z-10 flex flex-col items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl font-bold text-center leading-tight"
          >
            {displayedText}
            <span className="blinking-cursor">|</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-gray-300 mt-6 text-center max-w-xl text-lg"
          >
            Una experiencia moderna para tus clientes. Menús diseñados para celulares, rápidos de
            leer y fáciles de actualizar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.5 }}
            className="mt-10"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                router.push('/menu')
              }}
            >
              Ver Menú
            </Button>
          </motion.div>
        </div>
      </motion.main>
    </AnimatePresence>
  )
}
