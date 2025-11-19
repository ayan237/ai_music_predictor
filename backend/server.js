const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const moodRoutes = require('./routes/moods')
const playlistRoutes = require('./routes/playlists')
const favoritesRoutes = require('./routes/favorites')
const userRoutes = require('./routes/users')

const app = express()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Database connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/moodmatcher'
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message)
    if (err.message.includes('authentication failed')) {
      console.error('Check your MongoDB credentials in MONGODB_URI')
    } else if (err.message.includes('timeout')) {
      console.error('MongoDB connection timeout. Check your network and MongoDB server status')
    } else if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      console.error('Cannot resolve MongoDB hostname. Check your MONGODB_URI connection string')
    }
  })

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/moods', moodRoutes)
app.use('/api/playlists', playlistRoutes)
app.use('/api/favorites', favoritesRoutes)
app.use('/api/users', userRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

