'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

import { useMenuData } from '@/contexts/MenuDataProvider'

// Animation configuration
const ANIMATION_CONFIG = {
  blobs: [
    {
      className:
        'absolute -top-20 -left-20 h-96 w-96 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-gradient-to-br from-cyan-300/80 via-blue-400/70 to-indigo-500/60 blur-2xl',
      subtleClassName:
        'absolute -top-20 -left-20 h-96 w-96 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-gradient-to-br from-cyan-300/20 via-blue-400/15 to-indigo-500/10 blur-2xl',
      animation: {
        x: [0, 30, -20, 0],
        y: [0, -20, 30, 0],
        rotate: [0, 5, -3, 0],
        borderRadius: [
          '60% 40% 30% 70% / 60% 30% 70% 40%',
          '40% 60% 70% 30% / 40% 70% 30% 60%',
          '70% 30% 40% 60% / 70% 40% 60% 30%',
          '60% 40% 30% 70% / 60% 30% 70% 40%',
        ],
      },
      transition: { duration: 20, repeat: Infinity, ease: 'easeInOut' as const },
    },
    {
      className:
        'absolute top-1/3 -right-20 h-[28rem] w-[28rem] rounded-[30%_60%_70%_40%/50%_60%_30%_60%] bg-gradient-to-br from-fuchsia-300/80 via-pink-400/70 to-rose-500/60 blur-2xl',
      subtleClassName:
        'absolute top-1/3 -right-20 h-[28rem] w-[28rem] rounded-[30%_60%_70%_40%/50%_60%_30%_60%] bg-gradient-to-br from-fuchsia-300/20 via-pink-400/15 to-rose-500/10 blur-2xl',
      animation: {
        x: [0, -40, 25, 0],
        y: [0, 25, -30, 0],
        rotate: [0, -4, 6, 0],
        borderRadius: [
          '30% 60% 70% 40% / 50% 60% 30% 60%',
          '60% 30% 40% 70% / 30% 50% 70% 40%',
          '40% 70% 30% 60% / 60% 40% 50% 30%',
          '30% 60% 70% 40% / 50% 60% 30% 60%',
        ],
      },
      transition: { duration: 25, repeat: Infinity, ease: 'easeInOut' as const, delay: 2 },
    },
    {
      className:
        'absolute bottom-0 right-1/6 h-80 w-80 rounded-[70%_30%_40%_60%/40%_70%_60%_30%] bg-gradient-to-br from-emerald-300/80 via-green-400/70 to-teal-500/60 blur-2xl',
      subtleClassName:
        'absolute bottom-0 right-1/6 h-80 w-80 rounded-[70%_30%_40%_60%/40%_70%_60%_30%] bg-gradient-to-br from-emerald-300/20 via-green-400/15 to-teal-500/10 blur-2xl',
      animation: {
        x: [0, 20, -35, 0],
        y: [0, -15, 20, 0],
        rotate: [0, 3, -5, 0],
        borderRadius: [
          '70% 30% 40% 60% / 40% 70% 60% 30%',
          '30% 70% 60% 40% / 70% 30% 40% 60%',
          '60% 40% 70% 30% / 30% 60% 70% 40%',
          '70% 30% 40% 60% / 40% 70% 60% 30%',
        ],
      },
      transition: { duration: 18, repeat: Infinity, ease: 'easeInOut' as const, delay: 5 },
    },
  ],
  particles: [
    {
      size: 'h-2 w-2',
      color: 'bg-cyan-200/90',
      subtleColor: 'bg-cyan-200/30',
      pos: 'top-1/4 left-1/3',
      delay: 0,
    },
    {
      size: 'h-1.5 w-1.5',
      color: 'bg-fuchsia-200/90',
      subtleColor: 'bg-fuchsia-200/30',
      pos: 'top-1/3 right-1/4',
      delay: 1,
    },
    {
      size: 'h-1 w-1',
      color: 'bg-emerald-200/90',
      subtleColor: 'bg-emerald-200/30',
      pos: 'top-1/2 left-1/2',
      delay: 0.5,
    },
    {
      size: 'h-2.5 w-2.5',
      color: 'bg-blue-200/90',
      subtleColor: 'bg-blue-200/30',
      pos: 'bottom-1/3 right-1/3',
      delay: 2,
    },
    {
      size: 'h-1.5 w-1.5',
      color: 'bg-pink-200/90',
      subtleColor: 'bg-pink-200/30',
      pos: 'bottom-1/4 left-1/5',
      delay: 1.5,
    },
  ],
  glowOrbs: [
    {
      className: 'absolute top-1/6 left-1/6 h-16 w-16 rounded-full bg-cyan-100/40 blur-md',
      subtleClassName: 'absolute top-1/6 left-1/6 h-16 w-16 rounded-full bg-cyan-100/20 blur-md',
      animation: {
        scale: [1, 1.3, 0.8, 1.1, 1],
        opacity: [0.4, 0.7, 0.3, 0.6, 0.4],
        x: [0, 15, -10, 5, 0],
        y: [0, -10, 20, -5, 0],
      },
      transition: { duration: 12, repeat: Infinity, ease: 'easeInOut' as const },
    },
    {
      className: 'absolute bottom-1/6 right-1/6 h-12 w-12 rounded-full bg-fuchsia-100/50 blur-md',
      subtleClassName:
        'absolute bottom-1/6 right-1/6 h-12 w-12 rounded-full bg-fuchsia-100/25 blur-md',
      animation: {
        scale: [1, 0.7, 1.4, 0.9, 1],
        opacity: [0.5, 0.8, 0.3, 0.7, 0.5],
        x: [0, -12, 18, -8, 0],
        y: [0, 15, -8, 12, 0],
      },
      transition: { duration: 15, repeat: Infinity, ease: 'easeInOut' as const, delay: 3 },
    },
  ],
}

// Reusable animation components
function AnimatedBlobs({ isSubtle = false }: { isSubtle?: boolean }) {
  return (
    <>
      {ANIMATION_CONFIG.blobs.map((blob, index) => (
        <motion.div
          key={index}
          className={isSubtle ? blob.subtleClassName : blob.className}
          animate={blob.animation}
          transition={blob.transition}
          style={{ willChange: 'transform' }}
        />
      ))}
    </>
  )
}

function AnimatedParticles({ isSubtle = false }: { isSubtle?: boolean }) {
  return (
    <>
      {ANIMATION_CONFIG.particles.map((particle, index) => (
        <motion.div
          key={index}
          className={`absolute ${particle.pos} ${particle.size} rounded-full ${isSubtle ? particle.subtleColor : particle.color}`}
          animate={{
            y: isSubtle ? [0, -10, 5, -5, 0] : [0, -20, 15, -10, 0],
            x: isSubtle ? [0, 5, -8, 4, 0] : [0, 10, -15, 8, 0],
            scale: isSubtle ? [1, 1.1, 0.9, 1.05, 1] : [1, 1.2, 0.8, 1.1, 1],
            opacity: isSubtle ? [0.3, 0.5, 0.2, 0.4, 0.3] : [0.9, 1, 0.7, 1, 0.9],
          }}
          transition={{
            duration: 8 + index * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
          }}
        />
      ))}
    </>
  )
}

function AnimatedGlowOrbs({ isSubtle = false }: { isSubtle?: boolean }) {
  return (
    <>
      {ANIMATION_CONFIG.glowOrbs.map((orb, index) => (
        <motion.div
          key={index}
          className={isSubtle ? orb.subtleClassName : orb.className}
          animate={
            isSubtle
              ? {
                  scale: [1, 1.2, 0.8, 1.05, 1],
                  opacity: [0.2, 0.4, 0.1, 0.3, 0.2],
                  x: [0, 10, -5, 3, 0],
                  y: [0, -5, 10, -3, 0],
                }
              : orb.animation
          }
          transition={orb.transition}
        />
      ))}
    </>
  )
}

export default function AnimatedBackground() {
  const { restaurant } = useMenuData()

  const hasCustomBg = !!restaurant?.customBackground
  const hasAnimatedBg = restaurant?.showAnimatedBackground !== false

  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${!hasCustomBg ? 'bg-black will-change-transform' : ''} ${!hasAnimatedBg && !hasCustomBg ? ' bg-gradient-to-br from-gray-900 to-black' : ''}`}
    >
      {hasCustomBg && (
        <Image
          src={restaurant.customBackground!}
          alt="Custom background"
          fill
          className="object-cover"
        />
      )}
      {hasCustomBg || (hasAnimatedBg && <div className="absolute inset-0 bg-black/20" />)}
      {hasAnimatedBg && (
        <>
          <AnimatedBlobs />
          <AnimatedParticles />
          <AnimatedGlowOrbs />
        </>
      )}
    </div>
  )
}
