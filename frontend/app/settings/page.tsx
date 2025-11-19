'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [preferences, setPreferences] = useState({
    platform: 'both',
    theme: 'purple'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else if (user) {
      fetchPreferences()
    }
  }, [user, authLoading, router])

  const fetchPreferences = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/preferences`)
      setPreferences(response.data.preferences)
    } catch (error) {
      console.error('Failed to fetch preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async () => {
    setSaving(true)
    setMessage('')
    try {
      await axios.put(`${API_URL}/api/users/preferences`, preferences)
      setMessage('Preferences saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-primary overflow-x-hidden">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 gradient-text font-display px-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Settings
          </motion.h1>
          <motion.p 
            className="text-sm sm:text-base md:text-lg text-text-secondary mb-6 sm:mb-8 lg:mb-10 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Customize your experience and preferences
          </motion.p>

          <div className="space-y-6 lg:space-y-8">
            {/* Platform Preference */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6 lg:p-8"
            >
              <h2 className="text-2xl font-bold mb-2 text-text-primary font-display">Music Platform</h2>
              <p className="text-text-secondary mb-6">Choose your preferred music platform for recommendations</p>
              <div className="space-y-3">
                {['both', 'spotify', 'youtube'].map((platform, index) => (
                  <motion.label
                    key={platform}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="group flex items-center p-5 glass-card rounded-xl cursor-pointer relative overflow-hidden"
                    whileHover={{ scale: 1.02, x: 4 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <input
                      type="radio"
                      name="platform"
                      value={platform}
                      checked={preferences.platform === platform}
                      onChange={(e) => setPreferences({ ...preferences, platform: e.target.value })}
                      className="mr-4 w-5 h-5 text-neon-purple accent-neon-purple cursor-pointer relative z-10"
                    />
                    <span className="text-lg font-medium text-text-primary relative z-10 capitalize">
                      {platform === 'both' ? 'Both Platforms' : platform === 'spotify' ? 'Spotify Only' : 'YouTube Only'}
                    </span>
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Theme Preference */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card rounded-2xl p-6 lg:p-8"
            >
              <h2 className="text-2xl font-bold mb-2 text-text-primary font-display">Theme Color</h2>
              <p className="text-text-secondary mb-6">Choose your preferred accent color</p>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { theme: 'purple', gradient: 'from-neon-purple to-purple-600' },
                  { theme: 'blue', gradient: 'from-neon-blue to-blue-600' },
                  { theme: 'green', gradient: 'from-neon-green to-green-600' }
                ].map((item, index) => (
                  <motion.button
                    key={item.theme}
                    onClick={() => setPreferences({ ...preferences, theme: item.theme })}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className={`relative p-4 sm:p-6 rounded-xl border-2 transition-all overflow-hidden group ${
                      preferences.theme === item.theme
                        ? 'border-neon-purple shadow-lg shadow-neon-purple/30'
                        : 'border-gray-700/30 hover:border-neon-purple/50'
                    }`}
                    style={{
                      background: preferences.theme === item.theme
                        ? `linear-gradient(135deg, rgba(127, 90, 240, 0.3), rgba(127, 90, 240, 0.1))`
                        : 'rgba(17, 17, 24, 0.5)'
                    }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    <div className="relative z-10">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-gradient-to-br ${item.gradient}`} />
                      <div className="text-sm sm:text-base md:text-lg font-semibold capitalize text-text-primary">{item.theme}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Account Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="glass-card rounded-2xl p-6 lg:p-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-text-primary font-display">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Name</label>
                  <div className="px-4 py-3 glass-card rounded-xl text-text-primary font-medium">{user.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                  <div className="px-4 py-3 glass-card rounded-xl text-text-primary font-medium">{user.email}</div>
                </div>
              </div>
            </motion.div>

            {/* API Configuration Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass-card rounded-2xl p-6 lg:p-8 border-yellow-500/30 bg-yellow-500/5"
            >
              <div className="flex items-start gap-3 mb-4">
                <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-text-primary font-display">API Configuration</h2>
                  <p className="text-text-secondary mb-4">
                    To use Spotify and YouTube integrations, configure the following environment variables in your backend:
                  </p>
                  <ul className="space-y-2 text-sm">
                    {['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET', 'YOUTUBE_API_KEY'].map((key) => (
                      <li key={key} className="flex items-center gap-2">
                        <span className="text-yellow-400">•</span>
                        <code className="text-neon-purple font-mono text-xs bg-dark-secondary/50 px-2 py-1 rounded">
                          {key}
                        </code>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Save Button */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${
                  message.includes('success')
                    ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                    : 'bg-red-500/20 border border-red-500/50 text-red-400'
                }`}
              >
                {message}
              </motion.div>
            )}

            <motion.button
              onClick={savePreferences}
              disabled={saving}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-semibold rounded-xl shadow-lg shadow-neon-purple/30 hover:shadow-neon-purple/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group min-h-[44px] text-sm sm:text-base"
              whileHover={{ scale: saving ? 1 : 1.02, y: saving ? 0 : -2 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>Save Preferences</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

