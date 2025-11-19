'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    {
      title: "AI Face Detection",
      description: "Advanced emotion recognition using computer vision and deep learning models",
      gradient: "from-violet-500 to-purple-600"
    },
    {
      title: "Smart Text Analysis",
      description: "Natural language processing to understand sentiment and emotional context",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      title: "Curated Playlists",
      description: "Personalized music recommendations from Spotify and YouTube based on your mood",
      gradient: "from-pink-500 to-rose-600"
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-dark-primary">
      {/* Dynamic neon cursor effect */}
      <div 
        className="fixed w-96 h-96 rounded-full pointer-events-none z-0 opacity-30 blur-3xl transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(127, 90, 240, 0.4) 0%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto text-center w-full">
          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 sm:mb-12"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 gradient-text font-display">
              MoodSync
            </h1>
            <div className="text-base sm:text-lg md:text-xl text-text-primary mb-3 sm:mb-4 font-medium px-2">
              Where AI Meets Your Musical Soul
            </div>
            <p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed px-4">
              Experience the future of music discovery. Our advanced AI analyzes your emotions through facial expressions 
              or text to create the perfect soundtrack for your current state of mind.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 px-4"
          >
            <button
              onClick={() => router.push('/detect-mood')}
              className="w-full sm:w-auto btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] neon-glow-purple animate-neon-pulse"
            >
              Start Mood Detection
              <span className="ml-2">→</span>
            </button>
            
            <button
              onClick={() => router.push('/login')}
              className="w-full sm:w-auto btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 min-h-[44px]"
            >
              Sign In
            </button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-dark-secondary/50 backdrop-blur-md border border-gray-700/30 rounded-2xl p-6 sm:p-8 
                          hover:bg-dark-secondary/70 hover:border-neon-purple/30 transition-all duration-300 
                          card-hover group relative overflow-hidden"
              >
                {/* Neon accent line */}
                <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/80 rounded"></div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-text-primary group-hover:gradient-text transition-all duration-300 font-display">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 gradient-text px-2">
              Powered by Advanced AI
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-400 px-4">
              Our technology delivers industry-leading accuracy in emotion detection
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 px-4">
            {[
              { number: "95%", label: "Emotion Detection Accuracy" },
              { number: "50+", label: "Supported Emotions" },
              { number: "1M+", label: "Songs in Database" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 gradient-text px-2">
              How It Works
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto px-4">
              Three simple steps to discover your perfect musical match
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4">
            {[
              {
                step: "01",
                title: "Choose Detection Method",
                description: "Select between AI-powered facial emotion recognition or intelligent text sentiment analysis"
              },
              {
                step: "02", 
                title: "AI Analyzes Your Mood",
                description: "Our advanced algorithms process your input to determine your current emotional state with high precision"
              },
              {
                step: "03",
                title: "Get Perfect Playlists",
                description: "Receive curated music recommendations from Spotify and YouTube that match your detected mood"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="card text-center p-6 sm:p-8">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-text mb-3 sm:mb-4 opacity-20">
                    {step.step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-violet-500 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center px-4"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 gradient-text">
            Ready to Discover Your Musical Match?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already discovered the perfect soundtrack to their emotions
          </p>
          <button
            onClick={() => router.push('/signup')}
            className="w-full sm:w-auto btn-primary text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 min-h-[44px] glow-effect"
          >
            Get Started Free
          </button>
        </motion.div>
      </section>
    </div>
  )
}

