const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    // Warn if using fallback secret
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret || jwtSecret === 'fallback-secret') {
      console.warn('WARNING: Using fallback JWT secret. Set JWT_SECRET in environment variables for production!')
    }

    const decoded = jwt.verify(token, jwtSecret || 'fallback-secret')
    
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: 'Invalid token payload' })
    }

    const user = await User.findById(decoded.userId).select('-password_hash')
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }
    console.error('Auth middleware error:', error)
    return res.status(401).json({ message: 'Authentication failed' })
  }
}

module.exports = auth

