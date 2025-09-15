'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm border-b border-white/10"
    >
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🍽️</span>
            <span className="font-bold text-white">QR Menu</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/qr-menu"
              className={`px-3 py-2 rounded-md transition-colors ${
                pathname === '/'
                  ? 'bg-cyan-500/80 text-white font-medium'
                  : 'text-cyan-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/qr-menu/demo-menu"
              className={`px-3 py-2 rounded-md transition-colors ${
                pathname === '/demo-menu'
                  ? 'bg-cyan-500/80 text-white font-medium'
                  : 'text-cyan-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Demo
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
