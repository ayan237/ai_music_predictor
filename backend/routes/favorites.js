const express = require('express')
const Favorite = require('../models/Favorite')
const auth = require('../middleware/auth')

const router = express.Router()

// Valid platforms
const VALID_PLATFORMS = ['spotify', 'youtube']

// Add to favorites
router.post('/', auth, async (req, res) => {
  try {
    const { song_name, artist, platform, mood_tag, song_url, image_url } = req.body

    if (!song_name || !platform || !song_url) {
      return res.status(400).json({ message: 'Song name, platform, and URL are required' })
    }

    // Validate platform
    if (!VALID_PLATFORMS.includes(platform)) {
      return res.status(400).json({ 
        message: `Invalid platform. Must be one of: ${VALID_PLATFORMS.join(', ')}` 
      })
    }

    // Basic URL validation
    try {
      new URL(song_url)
    } catch (e) {
      return res.status(400).json({ message: 'Invalid song URL format' })
    }

    // Check if already favorited
    const existing = await Favorite.findOne({
      user_id: req.user._id,
      song_url
    })

    if (existing) {
      return res.status(400).json({ message: 'Song already in favorites' })
    }

    const favorite = new Favorite({
      user_id: req.user._id,
      song_name,
      artist,
      platform,
      mood_tag,
      song_url,
      image_url
    })

    await favorite.save()
    res.json(favorite)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get user's favorites
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user_id: req.user._id })
      .sort({ createdAt: -1 })

    res.json(favorites)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Remove from favorites
router.delete('/:id', auth, async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      _id: req.params.id,
      user_id: req.user._id
    })

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' })
    }

    await Favorite.deleteOne({ _id: req.params.id })
    res.json({ message: 'Removed from favorites' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router

