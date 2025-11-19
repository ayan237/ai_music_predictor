const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' })
    }

    // Validate name length
    if (name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters long' })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const password_hash = await bcrypt.hash(password, 10)
    const user = new User({ 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      password_hash 
    })
    await user.save()

    // Warn if using fallback secret
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret || jwtSecret === 'fallback-secret') {
      console.warn('WARNING: Using fallback JWT secret. Set JWT_SECRET in environment variables for production!')
    }

    const token = jwt.sign(
      { userId: user._id },
      jwtSecret || 'fallback-secret',
      { expiresIn: '7d' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user || !user.password_hash) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Warn if using fallback secret
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret || jwtSecret === 'fallback-secret') {
      console.warn('WARNING: Using fallback JWT secret. Set JWT_SECRET in environment variables for production!')
    }

    const token = jwt.sign(
      { userId: user._id },
      jwtSecret || 'fallback-secret',
      { expiresIn: '7d' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user })
})

// Logout
router.post('/logout', (req, res) => {
  res.cookie('token', '', { expires: new Date(0) })
  res.json({ message: 'Logged out successfully' })
})

module.exports = router

