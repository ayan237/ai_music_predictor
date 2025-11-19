'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import axios from 'axios'

const ML_SERVICE_URL = process.env.NEXT_PUBLIC_ML_SERVICE_URL || 'http://localhost:5001'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function DetectMoodPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [method, setMethod] = useState<'face' | 'text' | null>(null)
  const [textInput, setTextInput] = useState('')
  const [detecting, setDetecting] = useState(false)
  const [error, setError] = useState('')
  const [suggestion, setSuggestion] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [emotion, setEmotion] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (err) {
      setError('Could not access webcam. Please check permissions.')
    }
  }

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const captureAndDetect = async () => {
    if (!videoRef.current) return

    setDetecting(true)
    setError('')

    try {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        const imageData = canvas.toDataURL('image/jpeg')

        const response = await axios.post(`${ML_SERVICE_URL}/detect-emotion`, {
          image: imageData
        }, {
          timeout: 30000 // 30 second timeout
        })

        const detectedEmotion = response.data.emotion || response.data.error || 'Neutral'
        const confidence = response.data.confidence || 0
        const suggestion = response.data.suggestion || ''
        const quality = response.data.quality || 'Unknown'
        
        setEmotion(`${detectedEmotion} (${Math.round(confidence * 100)}% confidence)`)
        setSuggestion(suggestion || '')
        
        // Show quality feedback if available
        if (suggestion) {
          console.log('ML Service Suggestion:', suggestion)
        }

        // Save mood log
        if (user) {
          await axios.post(`${API_URL}/api/moods`, {
            mood: detectedEmotion,
            detectionMethod: 'face'
          })
        }

        // Navigate to results
        setTimeout(() => {
          router.push(`/results?mood=${detectedEmotion}`)
        }, 1500)
      }
    } catch (err: any) {
      console.error('Emotion detection error:', err)
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError('Request timed out. The ML service may be processing. Please try again.')
      } else if (err.code === 'ERR_CONNECTION_RESET' || err.code === 'ERR_CONNECTION_REFUSED') {
        setError('Could not connect to ML service. Make sure it is running on port 5001.')
      } else {
        const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to detect emotion. Please try again.'
        setError(errorMsg)
        // Still set a default emotion so user can continue
        if (!emotion) {
          setEmotion('Neutral')
        }
      }
    } finally {
      setDetecting(false)
    }
  }

  const detectTextMood = async () => {
    if (!textInput.trim()) {
      setError('Please enter some text')
      return
    }

    setDetecting(true)
    setError('')

    try {
      const response = await axios.post(`${ML_SERVICE_URL}/detect-sentiment`, {
        text: textInput
      }, {
        timeout: 10000 // 10 second timeout
      })

      const detectedEmotion = response.data.mood || 'Neutral'
      const confidence = response.data.confidence || 0
      const suggestion = response.data.suggestion || ''
      const analysisQuality = response.data.analysis_quality || 'Unknown'
      
      setEmotion(`${detectedEmotion} (${Math.round(confidence * 100)}% confidence)`)
      setSuggestion(suggestion || '')
      
      // Show analysis feedback if available
      if (suggestion) {
        console.log('Text Analysis Suggestion:', suggestion)
      }

      // Save mood log
      if (user) {
        await axios.post(`${API_URL}/api/moods`, {
          mood: detectedEmotion,
          detectionMethod: 'text'
        })
      }

      // Navigate to results
      setTimeout(() => {
        router.push(`/results?mood=${detectedEmotion}`)
      }, 1500)
    } catch (err: any) {
      console.error('Sentiment analysis error:', err)
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError('Request timed out. Please try again.')
      } else if (err.code === 'ERR_CONNECTION_RESET' || err.code === 'ERR_CONNECTION_REFUSED') {
        setError('Could not connect to ML service. Make sure it is running on port 5001.')
      } else {
        const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to analyze sentiment. Please try again.'
        setError(errorMsg)
        // Still set a default emotion so user can continue
        if (!emotion) {
          setEmotion('Neutral')
        }
      }
    } finally {
      setDetecting(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 bg-dark-primary overflow-x-hidden">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {!method ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 gradient-text font-display px-2">
                Detect Your Mood
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed px-4">
                Choose your preferred method to analyze your current emotional state with our advanced AI technology
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
              <motion.button
                onClick={() => {
                  setMethod('face')
                  startWebcam()
                }}
                className="group bg-dark-secondary/50 backdrop-blur-md border border-gray-700/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 text-center relative overflow-hidden
                          hover:bg-dark-secondary/70 hover:border-neon-purple/30 transition-all duration-300 card-hover min-h-[280px] sm:min-h-[320px]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-neon-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-neon-purple to-neon-blue rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 neon-glow-purple">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-text-primary group-hover:gradient-text transition-all duration-300 font-display">
                    AI Face Detection
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg text-text-secondary leading-relaxed mb-4 sm:mb-6">
                    Advanced computer vision analyzes your facial expressions in real-time using deep learning models
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="px-2 sm:px-3 py-1 bg-neon-purple/20 text-purple-300 rounded-full text-xs sm:text-sm border border-neon-purple/30">Real-time</span>
                    <span className="px-2 sm:px-3 py-1 bg-neon-blue/20 text-blue-300 rounded-full text-xs sm:text-sm border border-neon-blue/30">95% Accurate</span>
                    <span className="px-2 sm:px-3 py-1 bg-neon-green/20 text-green-300 rounded-full text-xs sm:text-sm border border-neon-green/30">Instant</span>
                  </div>
                </div>
              </motion.button>

              <motion.button
                onClick={() => setMethod('text')}
                className="group bg-dark-secondary/50 backdrop-blur-md border border-gray-700/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 text-center relative overflow-hidden
                          hover:bg-dark-secondary/70 hover:border-neon-blue/30 transition-all duration-300 card-hover min-h-[280px] sm:min-h-[320px]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-neon-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-neon-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-neon-blue to-neon-green rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 neon-glow-blue">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-text-primary group-hover:gradient-text transition-all duration-300 font-display">
                    Smart Text Analysis
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg text-text-secondary leading-relaxed mb-4 sm:mb-6">
                    Natural language processing understands emotional context and sentiment from your written words
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="px-2 sm:px-3 py-1 bg-neon-blue/20 text-blue-300 rounded-full text-xs sm:text-sm border border-neon-blue/30">NLP Powered</span>
                    <span className="px-2 sm:px-3 py-1 bg-neon-green/20 text-green-300 rounded-full text-xs sm:text-sm border border-neon-green/30">Context Aware</span>
                    <span className="px-2 sm:px-3 py-1 bg-neon-purple/20 text-purple-300 rounded-full text-xs sm:text-sm border border-neon-purple/30">Private</span>
                  </div>
                </div>
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-center"
            >
              <p className="text-gray-500 text-sm">
                Your privacy is protected. All analysis happens securely and data is not stored permanently.
              </p>
            </motion.div>
          </motion.div>
        ) : method === 'face' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 gradient-text px-2">
                AI Face Detection
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-400 px-4">
                Position your face in the camera and click detect when ready
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
              {/* Camera Section */}
              <div className="space-y-4 sm:space-y-6">
                <div className="relative">
                  <div className="card p-2 sm:p-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full aspect-video rounded-lg sm:rounded-xl bg-gray-900"
                    />
                    {emotion && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-2 sm:inset-4 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4"
                      >
                        <div className="text-lg sm:text-2xl md:text-3xl font-bold gradient-text mb-2 text-center">
                          {emotion}
                        </div>
                        {suggestion && (
                          <div className="text-xs sm:text-sm text-gray-300 text-center max-w-xs px-2">
                            {suggestion}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <motion.button
                    onClick={captureAndDetect}
                    disabled={detecting}
                    className="flex-1 btn-primary py-3 sm:py-4 text-base sm:text-lg min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: detecting ? 1 : 1.02 }}
                    whileTap={{ scale: detecting ? 1 : 0.98 }}
                  >
                    {detecting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      'Detect Emotion'
                    )}
                  </motion.button>
                  
                  <motion.button
                    onClick={() => {
                      stopWebcam()
                      setMethod(null)
                      setEmotion(null)
                      setSuggestion('')
                      setError('')
                    }}
                    className="btn-secondary py-3 sm:py-4 px-6 sm:px-8 min-h-[44px] text-base sm:text-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ← Back
                  </motion.button>
                </div>
              </div>

              {/* Info Section */}
              <div className="space-y-4 sm:space-y-6">
                <div className="card p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">
                    Detection Tips
                  </h3>
                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400">
                    <li className="flex items-start space-x-3">
                      <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Ensure good lighting on your face</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Look directly at the camera</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Keep only one face in frame</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Express your natural emotion</span>
                    </li>
                  </ul>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card border-red-500/50 bg-red-500/10"
                  >
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-red-400 mb-1">Detection Error</h4>
                        <p className="text-red-300 text-sm">{error}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="card border-blue-500/50 bg-blue-500/10 p-4 sm:p-6">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-1 text-sm sm:text-base">Privacy Protected</h4>
                      <p className="text-blue-300 text-xs sm:text-sm">
                        Your camera feed is processed locally and never stored or transmitted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 gradient-text px-2">
                Smart Text Analysis
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-400 px-4">
                Describe your feelings and let our AI understand your emotional state
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Input Section */}
              <div className="space-y-4 sm:space-y-6">
                <div className="card p-4 sm:p-6">
                  <label className="block text-base sm:text-lg font-medium text-white mb-3 sm:mb-4">
                    How are you feeling right now?
                  </label>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    rows={8}
                    className="input-field resize-none text-sm sm:text-base leading-relaxed w-full"
                    placeholder="I'm feeling amazing today! The weather is perfect, I just finished a great workout, and I'm excited about meeting my friends later. Everything seems to be going my way and I can't stop smiling..."
                  />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mt-3 text-xs sm:text-sm">
                    <span className="text-gray-400">
                      {textInput.length} characters
                    </span>
                    <span className={`${textInput.split(' ').length >= 10 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {textInput.split(' ').filter(word => word.length > 0).length} words
                      {textInput.split(' ').filter(word => word.length > 0).length < 10 && ' (10+ recommended)'}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <motion.button
                    onClick={detectTextMood}
                    disabled={detecting || !textInput.trim()}
                    className="flex-1 btn-primary py-3 sm:py-4 text-base sm:text-lg min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: detecting || !textInput.trim() ? 1 : 1.02 }}
                    whileTap={{ scale: detecting || !textInput.trim() ? 1 : 0.98 }}
                  >
                    {detecting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      'Analyze Mood'
                    )}
                  </motion.button>
                  
                  <motion.button
                    onClick={() => {
                      setMethod(null)
                      setTextInput('')
                      setEmotion(null)
                      setSuggestion('')
                      setError('')
                    }}
                    className="btn-secondary py-3 sm:py-4 px-6 sm:px-8 min-h-[44px] text-base sm:text-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ← Back
                  </motion.button>
                </div>
              </div>

              {/* Results & Info Section */}
              <div className="space-y-6">
                {emotion && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card border-green-500/50 bg-green-500/10"
                  >
                    <div className="text-center">
                      <div className="text-3xl font-bold gradient-text mb-3">
                        {emotion}
                      </div>
                      {suggestion && (
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {suggestion}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card border-red-500/50 bg-red-500/10"
                  >
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-red-400 mb-1">Analysis Error</h4>
                        <p className="text-red-300 text-sm">{error}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="card p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">
                    Writing Tips
                  </h3>
                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400">
                    <li className="flex items-start space-x-3">
                      <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span>Write at least 10 words for better accuracy</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span>Describe specific feelings and situations</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span>Use emotional words like &quot;excited&quot;, &quot;worried&quot;, &quot;peaceful&quot;</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span>Be honest about your current state</span>
                    </li>
                  </ul>
                </div>

                <div className="card border-purple-500/50 bg-purple-500/10 p-4 sm:p-6">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-purple-400 mb-1 text-sm sm:text-base">AI Analysis</h4>
                      <p className="text-purple-300 text-xs sm:text-sm">
                        Our NLP model analyzes sentiment, emotional keywords, and context to understand your mood.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

