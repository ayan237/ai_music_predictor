'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface Playlist {
  id: string
  name: string
  description?: string
  image_url?: string
  url: string
  tracks_count?: number
  owner?: string
  channel?: string
}

export default function ResultsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const mood = searchParams.get('mood') || 'Neutral'
  
  const [activeTab, setActiveTab] = useState<'spotify' | 'youtube'>('spotify')
  const [spotifyPlaylists, setSpotifyPlaylists] = useState<Playlist[]>([])
  const [youtubePlaylists, setYoutubePlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const moodColors: { [key: string]: string } = {
    'Happy': 'from-yellow-400 to-yellow-600',
    'Sad': 'from-blue-400 to-blue-600',
    'Angry': 'from-red-400 to-red-600',
    'Neutral': 'from-gray-400 to-gray-600',
    'Surprised': 'from-purple-400 to-purple-600',
    'Fear': 'from-orange-400 to-orange-600',
    'Disgust': 'from-green-400 to-green-600',
    'Calm': 'from-cyan-400 to-cyan-600'
  }

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    let isMounted = true

    const loadPlaylists = async () => {
      setLoading(true)
      setError('')

      try {
        // Fetch Spotify playlists
        try {
          const spotifyRes = await axios.get(`${API_URL}/api/playlists/spotify/${mood}`)
          if (isMounted) {
            setSpotifyPlaylists(spotifyRes.data?.playlists || [])
          }
        } catch (err: any) {
          console.error('Spotify error:', err)
          if (isMounted) {
            setError('Could not load Spotify playlists. Please check API configuration.')
          }
        }

        // Fetch YouTube playlists
        try {
          const youtubeRes = await axios.get(`${API_URL}/api/playlists/youtube/${mood}`)
          if (isMounted) {
            setYoutubePlaylists(youtubeRes.data?.playlists || [])
          }
        } catch (err: any) {
          console.error('YouTube error:', err)
          if (isMounted && !error) {
            setError('Could not load YouTube playlists. Please check API configuration.')
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load playlists')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadPlaylists()

    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood, user, router])


  const saveToFavorites = async (playlist: Playlist) => {
    try {
      await axios.post(`${API_URL}/api/favorites`, {
        song_name: playlist.name,
        artist: playlist.owner || playlist.channel || 'Various Artists',
        platform: activeTab,
        mood_tag: mood,
        song_url: playlist.url,
        image_url: playlist.image_url
      })
      alert('Saved to favorites!')
    } catch (err: any) {
      if (err.response?.status === 400 && err.response?.data?.message?.includes('already')) {
        alert('This playlist is already in your favorites!')
      } else {
        alert('Failed to save to favorites')
      }
    }
  }

  return (
    <div className="min-h-screen bg-dark-primary overflow-x-hidden">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            className={`w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mb-4 sm:mb-6 mx-auto rounded-full bg-gradient-to-br ${moodColors[mood] || 'from-neon-purple to-neon-blue'} flex items-center justify-center shadow-lg`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{mood.charAt(0)}</span>
          </motion.div>
          <motion.h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 gradient-text font-display px-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Detected Mood: {mood}
          </motion.h1>
          <motion.p 
            className="text-sm sm:text-base md:text-lg lg:text-xl text-text-secondary max-w-2xl mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Here are some playlists that match your mood perfectly
          </motion.p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10 px-4">
          <motion.button
            onClick={() => setActiveTab('spotify')}
            className={`relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 min-h-[44px] ${
              activeTab === 'spotify'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
                : 'glass-card text-text-secondary hover:text-text-primary'
            }`}
            whileHover={{ scale: activeTab === 'spotify' ? 1 : 1.05, y: activeTab === 'spotify' ? 0 : -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Spotify</span>
            {activeTab === 'spotify' && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 to-green-500 opacity-50 blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('youtube')}
            className={`relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 min-h-[44px] ${
              activeTab === 'youtube'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                : 'glass-card text-text-secondary hover:text-text-primary'
            }`}
            whileHover={{ scale: activeTab === 'youtube' ? 1 : 1.05, y: activeTab === 'youtube' ? 0 : -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">YouTube</span>
            {activeTab === 'youtube' && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400 to-red-500 opacity-50 blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8 p-4 sm:p-5 glass-card border-yellow-500/50 bg-yellow-500/10 rounded-xl mx-4 sm:mx-0"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-yellow-400 font-medium">{error}</p>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-neon-purple/30 border-t-neon-purple rounded-full animate-spin mb-4"></div>
            <p className="text-text-secondary text-lg">Loading playlists...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0"
          >
            {(activeTab === 'spotify' ? spotifyPlaylists : youtubePlaylists).map((playlist, index) => (
              <motion.div
                key={playlist.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                className="group glass-card rounded-2xl overflow-hidden relative"
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-neon-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {playlist.image_url && (
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={playlist.image_url}
                      alt={playlist.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-primary/90 via-dark-primary/20 to-transparent" />
                  </div>
                )}
                <div className="p-6 relative z-10">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2 text-text-primary group-hover:gradient-text transition-all duration-300 font-display">
                    {playlist.name}
                  </h3>
                  {playlist.description && (
                    <p className="text-text-secondary text-sm mb-4 line-clamp-2 leading-relaxed">
                      {playlist.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-text-muted mb-5">
                    <span className="flex items-center gap-2">
                      {playlist.owner && <span>by {playlist.owner}</span>}
                      {playlist.channel && <span>by {playlist.channel}</span>}
                    </span>
                    {playlist.tracks_count && (
                      <span className="px-2 py-1 bg-neon-purple/20 text-neon-purple rounded-full text-xs font-medium">
                        {playlist.tracks_count} tracks
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <motion.a
                      href={playlist.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-neon-purple to-neon-blue text-white text-center rounded-xl font-medium text-sm sm:text-base hover:shadow-lg hover:shadow-neon-purple/30 transition-all duration-300 min-h-[44px]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Open Playlist
                  </motion.a>
                  <motion.button
                    onClick={() => saveToFavorites(playlist)}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-neon-purple/50 rounded-xl hover:bg-neon-purple/20 hover:border-neon-purple transition-all duration-300 min-h-[44px] min-w-[44px]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Add to favorites"
                  >
                      <svg className="w-5 h-5 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && (activeTab === 'spotify' ? spotifyPlaylists : youtubePlaylists).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">No playlists found. Please check API configuration.</p>
          </div>
        )}

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => router.push('/detect-mood')}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 glass-card border-neon-purple/50 text-text-primary font-medium rounded-xl hover:border-neon-purple hover:bg-neon-purple/10 transition-all duration-300 min-h-[44px] text-sm sm:text-base"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Detect Mood Again
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

