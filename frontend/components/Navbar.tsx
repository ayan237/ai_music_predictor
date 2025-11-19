'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/detect-mood', label: 'Detect Mood' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/history', label: 'History' },
    { href: '/settings', label: 'Settings' }
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="fixed top-0 w-full z-50 bg-dark-primary/80 backdrop-blur-xl border-b border-neon-purple/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-neon-purple to-neon-blue rounded-lg flex items-center justify-center neon-glow-purple">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block font-display">
              MoodSync
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {user && navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 min-h-[36px] sm:min-h-[40px] flex items-center ${
                  isActive(item.href)
                    ? 'bg-neon-purple/20 text-text-primary border border-neon-purple/30 neon-glow-purple'
                    : 'text-text-secondary hover:text-text-primary hover:bg-dark-secondary/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* User Info */}
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-green rounded-full flex items-center justify-center neon-glow-blue">
                    <span className="text-white text-sm font-medium">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden lg:block">
                    <div className="text-sm font-medium text-text-primary">{user.name}</div>
                    <div className="text-xs text-text-secondary">{user.email}</div>
                  </div>
                </div>

                {/* Logout Button */}
                <motion.button
                  onClick={handleLogout}
                  className="btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-2 min-h-[36px] sm:min-h-[40px]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link href="/login" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors px-2 sm:px-0">
                  Sign In
                </Link>
                <Link href="/signup" className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-2 min-h-[36px] sm:min-h-[40px]">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            {user && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Toggle menu"
              >
                <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                  <div className={`w-full h-0.5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
                  <div className={`w-full h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
                  <div className={`w-full h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isMenuOpen ? 1 : 0, 
              height: isMenuOpen ? 'auto' : 0 
            }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t border-white/10"
          >
            <div className="py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all min-h-[44px] flex items-center ${
                    isActive(item.href)
                      ? 'bg-white/10 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}

