const mongoose = require('mongoose')

const moodLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    required: true,
    enum: ['Happy', 'Sad', 'Angry', 'Neutral', 'Surprised', 'Fear', 'Disgust', 'Calm']
  },
  detection_method: {
    type: String,
    required: true,
    enum: ['face', 'text']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('MoodLog', moodLogSchema)

