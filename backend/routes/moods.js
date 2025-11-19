const express = require('express')
const MoodLog = require('../models/MoodLog')
const auth = require('../middleware/auth')

const router = express.Router()

// Valid mood values
const VALID_MOODS = ['Happy', 'Sad', 'Angry', 'Neutral', 'Surprised', 'Fear', 'Disgust', 'Calm']
const VALID_METHODS = ['face', 'text']

// Create mood log
router.post('/', auth, async (req, res) => {
  try {
    const { mood, detectionMethod } = req.body

    if (!mood || !detectionMethod) {
      return res.status(400).json({ message: 'Mood and detection method are required' })
    }

    // Validate mood enum
    if (!VALID_MOODS.includes(mood)) {
      return res.status(400).json({ 
        message: `Invalid mood. Must be one of: ${VALID_MOODS.join(', ')}` 
      })
    }

    // Validate detection method
    if (!VALID_METHODS.includes(detectionMethod)) {
      return res.status(400).json({ 
        message: `Invalid detection method. Must be one of: ${VALID_METHODS.join(', ')}` 
      })
    }

    const moodLog = new MoodLog({
      user_id: req.user._id,
      mood,
      detection_method: detectionMethod
    })

    await moodLog.save()
    res.json(moodLog)
  } catch (error) {
    console.error('Error creating mood log:', error)
    res.status(500).json({ message: error.message || 'Failed to create mood log' })
  }
})

// Get user's mood history
router.get('/history', auth, async (req, res) => {
  try {
    const moods = await MoodLog.find({ user_id: req.user._id })
      .sort({ timestamp: -1 })
      .limit(100)

    res.json(moods)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get mood statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const moods = await MoodLog.find({ user_id: req.user._id })
    
    const stats = {
      total: moods.length,
      byMood: {},
      byMethod: {
        face: 0,
        text: 0
      },
      timeline: moods.map(m => ({
        mood: m.mood,
        timestamp: m.timestamp,
        method: m.detection_method
      }))
    }

    moods.forEach(mood => {
      if (mood.mood) {
        stats.byMood[mood.mood] = (stats.byMood[mood.mood] || 0) + 1
      }
      if (mood.detection_method && (mood.detection_method === 'face' || mood.detection_method === 'text')) {
        stats.byMethod[mood.detection_method] = (stats.byMethod[mood.detection_method] || 0) + 1
      }
    })

    res.json(stats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router

