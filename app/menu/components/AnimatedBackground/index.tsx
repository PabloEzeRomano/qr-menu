'use client'

import { motion } from 'framer-motion'

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-black will-change-transform">
      {/* Mesmerizing animated blobs with organic shapes - High contrast colors against black background */}
      <motion.div
        className="absolute -top-20 -left-20 h-96 w-96 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-gradient-to-br from-cyan-300/80 via-blue-400/70 to-indigo-500/60 blur-2xl"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 30, 0],
          rotate: [0, 5, -3, 0],
          borderRadius: [
            '60% 40% 30% 70% / 60% 30% 70% 40%',
            '40% 60% 70% 30% / 40% 70% 30% 60%',
            '70% 30% 40% 60% / 70% 40% 60% 30%',
            '60% 40% 30% 70% / 60% 30% 70% 40%',
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ willChange: 'transform' }}
      />
      <motion.div
        className="absolute top-1/3 -right-20 h-[28rem] w-[28rem] rounded-[30%_60%_70%_40%/50%_60%_30%_60%] bg-gradient-to-br from-fuchsia-300/80 via-pink-400/70 to-rose-500/60 blur-2xl"
        animate={{
          x: [0, -40, 25, 0],
          y: [0, 25, -30, 0],
          rotate: [0, -4, 6, 0],
          borderRadius: [
            '30% 60% 70% 40% / 50% 60% 30% 60%',
            '60% 30% 40% 70% / 30% 50% 70% 40%',
            '40% 70% 30% 60% / 60% 40% 50% 30%',
            '30% 60% 70% 40% / 50% 60% 30% 60%',
          ],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        style={{ willChange: 'transform' }}
      />
      <motion.div
        className="absolute bottom-0 right-1/6 h-80 w-80 rounded-[70%_30%_40%_60%/40%_70%_60%_30%] bg-gradient-to-br from-emerald-300/80 via-green-400/70 to-teal-500/60 blur-2xl"
        animate={{
          x: [0, 20, -35, 0],
          y: [0, -15, 20, 0],
          rotate: [0, 3, -5, 0],
          borderRadius: [
            '70% 30% 40% 60% / 40% 70% 60% 30%',
            '30% 70% 60% 40% / 70% 30% 40% 60%',
            '60% 40% 70% 30% / 30% 60% 70% 40%',
            '70% 30% 40% 60% / 40% 70% 60% 30%',
          ],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
        style={{ willChange: 'transform' }}
      />

      {/* Floating particles for extra mesmerization - Bright contrasting colors against black */}
      {[
        {
          size: 'h-2 w-2',
          color: 'bg-cyan-200/90',
          pos: 'top-1/4 left-1/3',
          delay: 0,
        },
        {
          size: 'h-1.5 w-1.5',
          color: 'bg-fuchsia-200/90',
          pos: 'top-1/3 right-1/4',
          delay: 1,
        },
        {
          size: 'h-1 w-1',
          color: 'bg-emerald-200/90',
          pos: 'top-1/2 left-1/2',
          delay: 0.5,
        },
        {
          size: 'h-2.5 w-2.5',
          color: 'bg-blue-200/90',
          pos: 'bottom-1/3 right-1/3',
          delay: 2,
        },
        {
          size: 'h-1.5 w-1.5',
          color: 'bg-pink-200/90',
          pos: 'bottom-1/4 left-1/5',
          delay: 1.5,
        },
        {
          size: 'h-1.5 w-1.5',
          color: 'bg-yellow-200/90',
          pos: 'top-1/6 left-1/6',
          delay: 3,
        },
        {
          size: 'h-2.5 w-2.5',
          color: 'bg-orange-200/90',
          pos: 'top-2/3 right-1/6',
          delay: 0.8,
        },
        {
          size: 'h-1 w-1',
          color: 'bg-red-200/90',
          pos: 'top-1/2 left-2/3',
          delay: 2.3,
        },
        {
          size: 'h-1.5 w-1.5',
          color: 'bg-teal-200/90',
          pos: 'bottom-1/6 left-1/2',
          delay: 1.2,
        },
        {
          size: 'h-2 w-2',
          color: 'bg-indigo-200/90',
          pos: 'top-1/3 left-1/5',
          delay: 0.3,
        },
        {
          size: 'h-1.5 w-1.5',
          color: 'bg-violet-200/90',
          pos: 'bottom-1/4 right-1/5',
          delay: 2.8,
        },
        {
          size: 'h-1 w-1',
          color: 'bg-lime-200/90',
          pos: 'top-3/4 left-3/4',
          delay: 1.8,
        },
        {
          size: 'h-2 w-2',
          color: 'bg-amber-200/90',
          pos: 'bottom-1/3 left-1/3',
          delay: 0.7,
        },
        {
          size: 'h-1.5 w-1.5',
          color: 'bg-sky-200/90',
          pos: 'top-1/5 right-1/3',
          delay: 2.5,
        },
        {
          size: 'h-1 w-1',
          color: 'bg-rose-200/90',
          pos: 'bottom-1/6 right-2/3',
          delay: 1.7,
        },
        {
          size: 'h-2.5 w-2.5',
          color: 'bg-purple-200/90',
          pos: 'top-2/3 left-1/4',
          delay: 0.2,
        },
        {
          size: 'h-1.5 w-1.5',
          color: 'bg-green-200/90',
          pos: 'bottom-1/5 left-2/3',
          delay: 2.2,
        },
        {
          size: 'h-1 w-1',
          color: 'bg-cyan-300/90',
          pos: 'top-1/4 right-1/5',
          delay: 1.4,
        },
        {
          size: 'h-2 w-2',
          color: 'bg-fuchsia-300/90',
          pos: 'bottom-2/3 right-1/4',
          delay: 0.9,
        },
        {
          size: 'h-1.5 w-1.5',
          color: 'bg-emerald-300/90',
          pos: 'top-1/2 right-1/2',
          delay: 2.7,
        },
      ].map((particle, index) => (
        <motion.div
          key={index}
          className={`absolute ${particle.pos} ${particle.size} rounded-full ${particle.color}`}
          animate={{
            y: [0, -20, 15, -10, 0],
            x: [0, 10, -15, 8, 0],
            scale: [1, 1.2, 0.8, 1.1, 1],
            opacity: [0.9, 1, 0.7, 1, 0.9],
          }}
          transition={{
            duration: 8 + index * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
          }}
        />
      ))}

      {/* Subtle glow orbs - Bright accent colors against black background */}
      <motion.div
        className="absolute top-1/6 left-1/6 h-16 w-16 rounded-full bg-cyan-100/40 blur-md"
        animate={{
          scale: [1, 1.3, 0.8, 1.1, 1],
          opacity: [0.4, 0.7, 0.3, 0.6, 0.4],
          x: [0, 15, -10, 5, 0],
          y: [0, -10, 20, -5, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/6 right-1/6 h-12 w-12 rounded-full bg-fuchsia-100/50 blur-md"
        animate={{
          scale: [1, 0.7, 1.4, 0.9, 1],
          opacity: [0.5, 0.8, 0.3, 0.7, 0.5],
          x: [0, -12, 18, -8, 0],
          y: [0, 15, -8, 12, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
      />
    </div>
  )
}
