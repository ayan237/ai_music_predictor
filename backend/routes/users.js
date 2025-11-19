const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

// Valid preference values
const VALID_PLATFORMS = ['spotify', 'youtube', 'both']
const VALID_THEMES = ['purple', 'blue', 'green']

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { platform, theme } = req.body

    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (platform) {
      if (!VALID_PLATFORMS.includes(platform)) {
        return res.status(400).json({ 
          message: `Invalid platform. Must be one of: ${VALID_PLATFORMS.join(', ')}` 
        })
      }
      user.preferences.platform = platform
    }
    if (theme) {
      if (!VALID_THEMES.includes(theme)) {
        return res.status(400).json({ 
          message: `Invalid theme. Must be one of: ${VALID_THEMES.join(', ')}` 
        })
      }
      user.preferences.theme = theme
    }

    await user.save()
    res.json({ preferences: user.preferences })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get user preferences
router.get('/preferences', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ preferences: user.preferences })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router

