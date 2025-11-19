'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import axios from 'axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface MoodLog {
  _id: string
  mood: string
  detection_method: string
  timestamp: string
}

interface Favorite {
  _id: string
  song_name: string
  artist: string
  platform: string
  mood_tag: string
  song_url: string
  image_url?: string
  createdAt: string
}

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [moodStats, setMoodStats] = useState<any>(null)
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'timeline' | 'favorites'>('timeline')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else if (user) {
      fetchData()
    }
  }, [user, authLoading, router])

  const fetchData = async () => {
    try {
      const [statsRes, favoritesRes] = await Promise.all([
        axios.get(`${API_URL}/api/moods/stats`),
        axios.get(`${API_URL}/api/favorites`)
      ])
      setMoodStats(statsRes.data)
      setFavorites(favoritesRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/favorites/${id}`)
      setFavorites(favorites.filter(f => f._id !== id))
    } catch (error) {
      alert('Failed to remove favorite')
    }
  }

  if (authLoading || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    )
  }

  // Prepare chart data
  const timelineData = moodStats?.timeline || []
  const moodCounts = moodStats?.byMood || {}
  const methodCounts = moodStats?.byMethod || { face: 0, text: 0 }

  const lineChartData = {
    labels: timelineData.slice(0, 30).map((m: any) => 
      new Date(m.timestamp).toLocaleDateString()
    ),
    datasets: [{
      label: 'Mood Timeline',
      data: timelineData.slice(0, 30).map((m: any) => {
        const moodValues: { [key: string]: number } = {
          'Happy': 5, 'Calm': 4, 'Neutral': 3, 'Surprised': 3,
          'Sad': 2, 'Fear': 1, 'Angry': 1, 'Disgust': 1
        }
        return moodValues[m.mood] || 3
      }),
      borderColor: 'rgb(100, 0, 255)',
      backgroundColor: 'rgba(100, 0, 255, 0.1)',
      tension: 0.4
    }]
  }

  const barChartData = {
    labels: Object.keys(moodCounts),
    datasets: [{
      label: 'Mood Frequency',
      data: Object.values(moodCounts),
      backgroundColor: [
        'rgba(100, 0, 255, 0.6)',
        'rgba(0, 113, 255, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
      ]
    }]
  }

  const methodChartData = {
    labels: ['Face Detection', 'Text Analysis'],
    datasets: [{
      data: [methodCounts.face || 0, methodCounts.text || 0],
      backgroundColor: [
        'rgba(100, 0, 255, 0.6)',
        'rgba(0, 113, 255, 0.6)',
      ]
    }]
  }

  return (
    <div className="min-h-screen bg-dark-primary overflow-x-hidden">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
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
            Your Mood History
          </motion.h1>
          <motion.p 
            className="text-sm sm:text-base md:text-lg text-text-secondary mb-6 sm:mb-8 lg:mb-10 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Track your emotional journey and discover patterns in your moods
          </motion.p>

          {/* Tabs */}
          <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <motion.button
              onClick={() => setActiveTab('timeline')}
              className={`relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 min-h-[44px] whitespace-nowrap ${
                activeTab === 'timeline'
                  ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-lg shadow-neon-purple/30'
                  : 'glass-card text-text-secondary hover:text-text-primary'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: activeTab === 'timeline' ? 1 : 1.05, y: activeTab === 'timeline' ? 0 : -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Timeline</span>
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('favorites')}
              className={`relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 min-h-[44px] whitespace-nowrap ${
                activeTab === 'favorites'
                  ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-lg shadow-neon-purple/30'
                  : 'glass-card text-text-secondary hover:text-text-primary'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: activeTab === 'favorites' ? 1 : 1.05, y: activeTab === 'favorites' ? 0 : -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Favorites ({favorites.length})</span>
            </motion.button>
          </div>

          {activeTab === 'timeline' ? (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { value: moodStats?.total || 0, label: 'Total Moods Detected', color: 'from-neon-purple to-purple-600', delay: 0.5 },
                  { value: methodCounts.face || 0, label: 'Face Detections', color: 'from-neon-blue to-blue-600', delay: 0.6 },
                  { value: methodCounts.text || 0, label: 'Text Analyses', color: 'from-neon-green to-green-600', delay: 0.7 },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: stat.delay }}
                    className="group glass-card rounded-2xl p-6 relative overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    <div className="relative z-10">
                      <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                      <div className="text-text-secondary font-medium">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts */}
              {timelineData.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="glass-card rounded-2xl p-6 lg:p-8"
                  >
                    <h3 className="text-xl font-bold mb-6 text-text-primary font-display">Mood Timeline</h3>
                    <Line data={lineChartData} options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: 'rgba(17, 17, 24, 0.95)',
                          borderColor: 'rgba(127, 90, 240, 0.5)',
                          borderWidth: 1,
                          titleColor: '#ECECEC',
                          bodyColor: '#A1A1A1',
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 5,
                          ticks: { color: '#A1A1A1' },
                          grid: { color: 'rgba(127, 90, 240, 0.1)' }
                        },
                        x: {
                          ticks: { color: '#A1A1A1' },
                          grid: { color: 'rgba(127, 90, 240, 0.1)' }
                        }
                      }
                    }} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="glass-card rounded-2xl p-6 lg:p-8"
                  >
                    <h3 className="text-xl font-bold mb-6 text-text-primary font-display">Mood Distribution</h3>
                    <Bar data={barChartData} options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: 'rgba(17, 17, 24, 0.95)',
                          borderColor: 'rgba(127, 90, 240, 0.5)',
                          borderWidth: 1,
                          titleColor: '#ECECEC',
                          bodyColor: '#A1A1A1',
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { color: '#A1A1A1' },
                          grid: { color: 'rgba(127, 90, 240, 0.1)' }
                        },
                        x: {
                          ticks: { color: '#A1A1A1' },
                          grid: { color: 'rgba(127, 90, 240, 0.1)' }
                        }
                      }
                    }} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="glass-card rounded-2xl p-6 lg:p-8 lg:col-span-2"
                  >
                    <h3 className="text-xl font-bold mb-6 text-text-primary font-display">Detection Methods</h3>
                    <div className="flex justify-center">
                      <div className="w-64 h-64">
                        <Doughnut data={methodChartData} options={{
                          responsive: true,
                          maintainAspectRatio: true,
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: { 
                                color: '#A1A1A1',
                                font: { size: 14 },
                                padding: 15
                              }
                            },
                            tooltip: {
                              backgroundColor: 'rgba(17, 17, 24, 0.95)',
                              borderColor: 'rgba(127, 90, 240, 0.5)',
                              borderWidth: 1,
                              titleColor: '#ECECEC',
                              bodyColor: '#A1A1A1',
                            }
                          }
                        }} />
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  className="text-center py-20 glass-card rounded-2xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <svg className="w-16 h-16 mx-auto mb-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-text-secondary text-xl mb-6">No mood history yet. Start detecting your mood!</p>
                  <motion.button
                    onClick={() => router.push('/detect-mood')}
                    className="px-8 py-4 bg-gradient-to-r from-neon-purple to-neon-blue text-white rounded-xl font-medium shadow-lg shadow-neon-purple/30"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Detect Mood
                  </motion.button>
                </motion.div>
              )}
            </div>
          ) : (
            <div>
              {favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {favorites.map((favorite, index) => (
                    <motion.div
                      key={favorite._id}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                      className="group glass-card rounded-2xl overflow-hidden relative"
                      whileHover={{ y: -8, scale: 1.02 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-neon-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {favorite.image_url && (
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={favorite.image_url}
                            alt={favorite.song_name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-dark-primary/90 via-dark-primary/20 to-transparent" />
                        </div>
                      )}
                      <div className="p-6 relative z-10">
                        <h3 className="text-xl font-bold mb-2 text-text-primary group-hover:gradient-text transition-all duration-300 font-display line-clamp-2">
                          {favorite.song_name}
                        </h3>
                        <p className="text-text-secondary text-sm mb-4">{favorite.artist}</p>
                        <div className="flex items-center gap-2 mb-5">
                          <span className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded-full text-xs font-medium">
                            {favorite.platform}
                          </span>
                          {favorite.mood_tag && (
                            <span className="px-3 py-1 bg-neon-blue/20 text-neon-blue rounded-full text-xs font-medium">
                              {favorite.mood_tag}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <motion.a
                            href={favorite.song_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-neon-purple to-neon-blue text-white text-center rounded-xl font-medium text-sm sm:text-base hover:shadow-lg hover:shadow-neon-purple/30 transition-all duration-300 min-h-[44px]"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Open
                          </motion.a>
                          <motion.button
                            onClick={() => removeFavorite(favorite._id)}
                            className="px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-red-500/50 rounded-xl hover:bg-red-500/20 hover:border-red-500 transition-all duration-300 min-h-[44px] min-w-[44px]"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="Remove from favorites"
                          >
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="text-center py-20 glass-card rounded-2xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <svg className="w-16 h-16 mx-auto mb-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <p className="text-text-secondary text-xl">No favorites yet. Start exploring playlists!</p>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

