'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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
    <>
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 pt-24 pb-20">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-6xl font-bold text-center leading-tight"
        >
          {displayedText}
          <span className="blinking-cursor">|</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-cyan-200 mt-6 text-center max-w-xl"
        >
          Una experiencia moderna para tus clientes. Menús diseñados para celulares, rápidos de leer
          y fáciles de actualizar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-10"
        >
          <button
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-all shadow-lg hover:shadow-cyan-500/25"
            onClick={() => {
              router.push('/demo-menu')
            }}
          >
            Probar demo
          </button>
        </motion.div>
      </main>
    </>
  )
}
