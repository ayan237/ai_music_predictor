const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password_hash: {
    type: String,
    required: function() {
      return !this.googleId
    }
  },
  googleId: {
    type: String,
    sparse: true
  },
  preferences: {
    platform: {
      type: String,
      enum: ['spotify', 'youtube', 'both'],
      default: 'both'
    },
    theme: {
      type: String,
      enum: ['purple', 'blue', 'green'],
      default: 'purple'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password_hash)
}

module.exports = mongoose.model('User', userSchema)

