const mongoose = require('mongoose')

const favoriteSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  song_name: {
    type: String,
    required: true
  },
  artist: {
    type: String
  },
  platform: {
    type: String,
    required: true,
    enum: ['spotify', 'youtube']
  },
  mood_tag: {
    type: String
  },
  song_url: {
    type: String,
    required: true
  },
  image_url: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Favorite', favoriteSchema)

