const express = require('express')
const axios = require('axios')
const auth = require('../middleware/auth')

const router = express.Router()

// Mood to search keyword mapping
const moodKeywords = {
  'Happy': 'happy upbeat energetic',
  'Sad': 'sad melancholic emotional',
  'Angry': 'intense aggressive powerful',
  'Neutral': 'calm peaceful ambient',
  'Surprised': 'surprising unexpected dynamic',
  'Fear': 'dark atmospheric suspenseful',
  'Disgust': 'intense heavy aggressive',
  'Calm': 'peaceful relaxing meditative'
}

// Get Spotify playlists
router.get('/spotify/:mood', auth, async (req, res) => {
  try {
    const { mood } = req.params
    const keywords = moodKeywords[mood] || mood.toLowerCase()

    // Get Spotify access token
    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      console.error('Spotify API credentials missing')
      return res.status(500).json({ 
        message: 'Spotify API not configured. Please add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to backend/.env'
      })
    }

    // Get access token
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
        }
      }
    )

    const accessToken = tokenResponse.data?.access_token
    if (!accessToken) {
      return res.status(500).json({ 
        message: 'Failed to obtain Spotify access token'
      })
    }

    // Search for playlists
    const searchResponse = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: keywords,
        type: 'playlist',
        limit: 20
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      timeout: 10000 // 10 second timeout
    })

    // Validate response structure
    if (!searchResponse.data?.playlists?.items) {
      return res.json({ playlists: [], mood })
    }

    const playlists = searchResponse.data.playlists.items
      .filter(item => item !== null && item !== undefined && item.id) // prevent null/undefined items
      .map(item => ({
        id: item.id,
        name: item.name || 'Untitled Playlist',
        description: item.description || '',
        image_url: item.images?.[0]?.url || null,
        url: item.external_urls?.spotify || null,
        tracks_count: item.tracks?.total || 0,
        owner: item.owner?.display_name || 'Unknown'
      }))
  

    res.json({ playlists, mood })
  } catch (error) {
    console.error('Spotify API error:', error.message)
    console.error('Full error:', error)
    
    // Provide more helpful error messages
    let errorMessage = 'Failed to fetch Spotify playlists'
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'Spotify API authentication failed. Check your CLIENT_ID and CLIENT_SECRET'
      } else if (error.response.status === 400) {
        errorMessage = 'Invalid Spotify API request'
      }
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('timeout')) {
      errorMessage = 'Could not connect to Spotify API. Check your internet connection'
    }
    
    res.status(500).json({ 
      message: errorMessage, 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Get YouTube playlists
router.get('/youtube/:mood', auth, async (req, res) => {
  try {
    const { mood } = req.params
    const keywords = moodKeywords[mood] || mood.toLowerCase()
    const apiKey = process.env.YOUTUBE_API_KEY

    if (!apiKey) {
      console.error('YouTube API key missing')
      return res.status(500).json({ 
        message: 'YouTube API not configured. Please add YOUTUBE_API_KEY to backend/.env'
      })
    }

    // Search for playlists
    const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${keywords} music playlist`,
        type: 'playlist',
        maxResults: 20,
        key: apiKey
      },
      timeout: 10000 // 10 second timeout
    })

    // Validate response structure
    if (!searchResponse.data?.items || !Array.isArray(searchResponse.data.items)) {
      return res.json({ playlists: [], mood })
    }

    const playlists = searchResponse.data.items
      .filter(item => item?.id?.playlistId && item?.snippet) // Validate item structure
      .map(item => ({
        id: item.id.playlistId,
        name: item.snippet.title || 'Untitled Playlist',
        description: item.snippet.description || '',
        image_url: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || null,
        url: `https://www.youtube.com/playlist?list=${item.id.playlistId}`,
        channel: item.snippet.channelTitle || 'Unknown'
      }))

    res.json({ playlists, mood })
  } catch (error) {
    console.error('YouTube API error:', error.message)
    console.error('Full error:', error)
    
    // Provide more helpful error messages
    let errorMessage = 'Failed to fetch YouTube playlists'
    if (error.response) {
      if (error.response.status === 403) {
        errorMessage = 'YouTube API key invalid or quota exceeded'
      } else if (error.response.status === 400) {
        errorMessage = 'Invalid YouTube API request'
      }
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('timeout')) {
      errorMessage = 'Could not connect to YouTube API. Check your internet connection'
    }
    
    res.status(500).json({ 
      message: errorMessage, 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

module.exports = router

