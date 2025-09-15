'use client';

import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "Cargando carta" }: LoadingScreenProps) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Custom animated loader */}
        <div className="relative">
          {/* Food emojis loading ellipsis */}
          <div className="flex gap-4 mb-4">
            {[
              { emoji: '🍖', delay: 0 },
              { emoji: '🍕', delay: 0.3 },
              { emoji: '🍔', delay: 0.6 }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-5xl"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: item.delay,
                  ease: "easeInOut"
                }}
              >
                {item.emoji}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Loading text with animation */}
        <motion.p
          className="text-xl font-medium text-cyan-100"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {message}
        </motion.p>
      </div>
    </motion.main>
  );
}
