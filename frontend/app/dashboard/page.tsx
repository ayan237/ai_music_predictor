'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    moodsDetected: 0,
    favorites: 0,
    playlistsCreated: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user) {
      fetchStats()
    }
  }, [user, loading, router])

  const fetchStats = async () => {
    try {
      const [moodStatsRes, favoritesRes] = await Promise.all([
        axios.get(`${API_URL}/api/moods/stats`),
        axios.get(`${API_URL}/api/favorites`)
      ])
      setStats({
        moodsDetected: moodStatsRes.data.total || 0,
        favorites: favoritesRes.data.length || 0,
        playlistsCreated: moodStatsRes.data.total || 0 // Using mood count as proxy
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-primary">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <motion.h1 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 gradient-text font-display"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Welcome back, {user.name?.split(' ')[0]}
            </motion.h1>
            <motion.p 
              className="text-base sm:text-lg text-text-secondary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Ready to discover music that matches your mood?
            </motion.p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 lg:mb-10">
            <motion.div
              onClick={() => router.push('/detect-mood')}
              className="group glass-card rounded-xl sm:rounded-2xl p-6 sm:p-8 cursor-pointer relative overflow-hidden min-h-[200px] sm:min-h-[240px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-neon-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 bg-gradient-to-br from-neon-purple to-neon-blue rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-text-primary group-hover:gradient-text transition-all duration-300 font-display">
                  Detect Your Mood
                </h2>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-3 sm:mb-4">
                  Use AI-powered face detection or text analysis to discover your current emotional state
                </p>
                <div className="flex items-center text-neon-purple font-medium text-sm sm:text-base group-hover:translate-x-2 transition-transform duration-300">
                  Get Started <span className="ml-2">→</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              onClick={() => router.push('/history')}
              className="group glass-card rounded-xl sm:rounded-2xl p-6 sm:p-8 cursor-pointer relative overflow-hidden min-h-[200px] sm:min-h-[240px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-neon-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-neon-green opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 bg-gradient-to-br from-neon-blue to-neon-green rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-text-primary group-hover:gradient-text transition-all duration-300 font-display">
                  View History
                </h2>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-3 sm:mb-4">
                  Explore your mood timeline, favorite songs, and emotional insights
                </p>
                <div className="flex items-center text-neon-blue font-medium text-sm sm:text-base group-hover:translate-x-2 transition-transform duration-300">
                  Explore <span className="ml-2">→</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            className="glass-card rounded-xl sm:rounded-2xl p-6 sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-text-primary font-display">Quick Stats</h2>
            {loadingStats ? (
              <div className="text-center py-8 sm:py-12">
                <div className="inline-block w-10 h-10 sm:w-12 sm:h-12 border-4 border-neon-purple/30 border-t-neon-purple rounded-full animate-spin"></div>
                <p className="mt-4 text-sm sm:text-base text-text-secondary">Loading your stats...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { value: stats.moodsDetected, label: 'Moods Detected', color: 'from-neon-purple to-purple-600', delay: 0.6 },
                  { value: stats.favorites, label: 'Favorite Songs', color: 'from-neon-blue to-blue-600', delay: 0.7 },
                  { value: stats.playlistsCreated, label: 'Mood Sessions', color: 'from-neon-green to-green-600', delay: 0.8 },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: stat.delay }}
                    className="group relative p-4 sm:p-6 bg-dark-secondary/50 rounded-xl border border-gray-700/30 hover:border-neon-purple/50 transition-all duration-300 overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    <div className="relative z-10">
                      <div className={`text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                      <div className="text-text-secondary text-xs sm:text-sm font-medium">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

