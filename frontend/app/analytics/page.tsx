'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import { motion } from 'framer-motion'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface MoodStats {
  total: number
  byMood: { [key: string]: number }
  byMethod: { face: number; text: number }
  timeline: Array<{ mood: string; timestamp: string; method: string }>
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<MoodStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week')

  const moodColors = {
    Happy: '#10B981',
    Sad: '#3B82F6', 
    Angry: '#EF4444',
    Neutral: '#6B7280',
    Surprised: '#F59E0B',
    Fear: '#8B5CF6',
    Disgust: '#EC4899',
    Calm: '#06B6D4'
  }

  useEffect(() => {
    if (user) {
      fetchStats()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, timeRange])

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/moods/stats?range=${timeRange}`)
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMoodPercentage = (mood: string) => {
    if (!stats || stats.total === 0) return 0
    return Math.round((stats.byMood[mood] || 0) / stats.total * 100)
  }

  const getRecentMoodTrend = () => {
    if (!stats || stats.timeline.length === 0) return 'No data'
    
    const recent = stats.timeline.slice(0, 5)
    const moodCounts = recent.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1
      return acc
    }, {} as { [key: string]: number })
    
    const dominantMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0]
    
    return dominantMood || 'Mixed'
  }

  if (!user) {
    return <div>Please log in to view analytics</div>
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            Mood Analytics
          </h1>
          <p className="text-gray-400">Track your emotional journey through music</p>
        </motion.div>

        {/* Time Range Selector */}
        <div className="flex gap-4 mb-8">
          {(['week', 'month', 'all'] as const).map((range) => (
            <motion.button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg capitalize ${
                timeRange === range
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/5 border border-primary-500/30 text-gray-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {range === 'all' ? 'All Time' : `Past ${range}`}
            </motion.button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Overview Cards */}
            <div className="lg:col-span-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-primary-500/30"
              >
                <h3 className="text-xl font-semibold mb-4">Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Detections</span>
                    <span className="font-semibold">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Recent Trend</span>
                    <span className="font-semibold">{getRecentMoodTrend()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Face Detection</span>
                    <span className="font-semibold">{stats.byMethod.face}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Text Analysis</span>
                    <span className="font-semibold">{stats.byMethod.text}</span>
                  </div>
                </div>
              </motion.div>

              {/* Mood Distribution */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-primary-500/30"
              >
                <h3 className="text-xl font-semibold mb-4">Mood Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(stats.byMood).map(([mood, count]) => (
                    <div key={mood} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{mood}</span>
                        <span>{getMoodPercentage(mood)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${getMoodPercentage(mood)}%` }}
                          transition={{ delay: 0.2, duration: 0.8 }}
                          className="h-2 rounded-full"
                          style={{ backgroundColor: moodColors[mood as keyof typeof moodColors] || '#6B7280' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-primary-500/30"
            >
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {stats.timeline.slice(0, 20).map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: moodColors[entry.mood as keyof typeof moodColors] || '#6B7280' }}
                      />
                      <span className="font-medium">{entry.mood}</span>
                      <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">
                        {entry.method}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No mood data available yet. Start detecting your mood!</p>
          </div>
        )}
      </div>
    </div>
  )
}