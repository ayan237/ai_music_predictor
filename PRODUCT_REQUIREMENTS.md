# Product Requirements Document (PRD)
## AI Music Mood Matcher 🎵

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Production Ready

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Vision & Purpose](#product-vision--purpose)
3. [Target Users](#target-users)
4. [Core Features](#core-features)
5. [How It Works](#how-it-works)
6. [User Flows](#user-flows)
7. [Technical Architecture](#technical-architecture)
8. [Data Models](#data-models)
9. [API Specifications](#api-specifications)
10. [User Interface & Experience](#user-interface--experience)
11. [Performance Requirements](#performance-requirements)
12. [Security & Privacy](#security--privacy)
13. [Future Enhancements](#future-enhancements)

---

## Executive Summary

**AI Music Mood Matcher** is an intelligent web application that combines artificial intelligence with music streaming services to create a personalized music discovery experience. The product detects users' emotional states through facial recognition or text-based sentiment analysis, then automatically curates and recommends playlists from Spotify and YouTube that match their current mood.

### Key Value Propositions
- **Instant Mood Detection**: Real-time emotion recognition using advanced AI models
- **Personalized Music Discovery**: Automated playlist curation based on emotional state
- **Multi-Platform Integration**: Seamless access to both Spotify and YouTube playlists
- **Mood Tracking**: Historical analysis of emotional patterns over time
- **User-Centric Design**: Modern, intuitive interface with smooth animations

---

## Product Vision & Purpose

### Vision Statement
To create a seamless bridge between human emotions and music, enabling users to discover the perfect soundtrack for every moment of their lives through AI-powered mood detection.

### Purpose
The product addresses the common challenge of finding music that matches one's current emotional state. Instead of manually searching through playlists or relying on generic recommendations, users can:

1. **Express their mood** through natural interaction (camera or text)
2. **Receive instant AI analysis** of their emotional state
3. **Discover curated playlists** automatically matched to their mood
4. **Track emotional patterns** over time for self-awareness
5. **Build a personal music library** of mood-matched favorites

### Problem Statement
- Users often struggle to find music that matches their current emotional state
- Manual playlist searching is time-consuming and may not capture nuanced emotions
- Generic music recommendations don't account for real-time emotional context
- There's no easy way to track how music choices relate to emotional patterns

### Solution
An AI-powered platform that:
- Detects emotions in real-time using facial recognition or text analysis
- Maps detected emotions to appropriate music genres and playlists
- Integrates with major music platforms (Spotify, YouTube) for instant access
- Provides historical tracking and analytics for emotional patterns
- Offers a beautiful, intuitive user experience

---

## Target Users

### Primary Users
1. **Music Enthusiasts** (18-35 years)
   - Active music listeners seeking personalized experiences
   - Users who value emotional connection with music
   - Tech-savvy individuals comfortable with AI-powered tools

2. **Wellness & Self-Care Seekers** (25-45 years)
   - Individuals interested in mood tracking and emotional awareness
   - Users who use music for emotional regulation
   - People seeking tools for mental wellness

3. **Casual Music Listeners** (All ages)
   - Users who want quick access to mood-appropriate music
   - People who prefer automated recommendations over manual searching
   - Individuals looking for variety in their music discovery

### User Personas

**Persona 1: "The Mood Explorer"**
- Age: 24, Student/Young Professional
- Tech Comfort: High
- Music Habits: Listens to music daily, uses multiple platforms
- Goals: Discover new music, match music to current feelings
- Pain Points: Too many choices, doesn't know what to listen to

**Persona 2: "The Wellness Tracker"**
- Age: 32, Professional
- Tech Comfort: Medium-High
- Music Habits: Uses music for relaxation and focus
- Goals: Track emotional patterns, use music for mood regulation
- Pain Points: Wants to understand emotional patterns, needs quick access

**Persona 3: "The Casual Listener"**
- Age: 28, Professional
- Tech Comfort: Medium
- Music Habits: Listens occasionally, prefers simplicity
- Goals: Quick access to appropriate music without effort
- Pain Points: Doesn't want to spend time searching, wants automation

---

## Core Features

### 1. Dual Mood Detection System

#### 1.1 Facial Emotion Recognition
**Purpose**: Detect emotions through real-time facial analysis using webcam input.

**How It Works**:
- User grants camera permission
- System captures a photo or video frame
- Image is sent to ML service for analysis
- DeepFace library analyzes facial expressions using ensemble models
- Returns detected emotion with confidence score

**Technical Details**:
- Uses multiple DeepFace models (VGG-Face, Facenet, OpenFace, DeepFace) for ensemble voting
- Image preprocessing: histogram equalization, Gaussian blur for noise reduction
- Face quality checks: detects single face, validates size and clarity
- Confidence threshold: Minimum 30% confidence required, defaults to Neutral if below
- Emotion mapping: Maps 7 base emotions (happy, sad, angry, neutral, surprise, fear, disgust) to mood labels

**Supported Emotions**:
- Happy → Upbeat, energetic playlists
- Sad → Melancholic, emotional playlists
- Angry → Intense, powerful playlists
- Neutral → Calm, peaceful playlists
- Surprised → Dynamic, unexpected playlists
- Fear → Dark, atmospheric playlists
- Disgust → Intense, heavy playlists

**User Experience**:
- Real-time camera preview
- Capture button with visual feedback
- Processing indicator during analysis
- Results displayed with confidence percentage
- Suggestions based on detected emotion

#### 1.2 Text-Based Sentiment Analysis
**Purpose**: Detect mood through natural language text input.

**How It Works**:
- User types or pastes text describing their feelings
- Text is analyzed using multiple sentiment analysis tools
- Combines VADER, TextBlob, and keyword analysis
- Returns mood classification with confidence score

**Technical Details**:
- **VADER Sentiment**: Analyzes polarity and compound scores
- **TextBlob**: Provides additional polarity and subjectivity scores
- **Keyword Analysis**: Detects emotion-specific keywords (happy, sad, angry, calm, anxious)
- **Weighted Combination**: 
  - VADER: 40% weight
  - TextBlob: 30% weight
  - Keywords: 30% weight
- **Confidence Adjustment**: Adjusted based on text subjectivity (more subjective = higher confidence)
- **Minimum Text Length**: Requires at least 3 words for accurate analysis

**Mood Mapping**:
- Compound score ≥ 0.5 → Happy
- Compound score ≥ 0.1 → Calm
- Compound score -0.1 to 0.1 → Neutral
- Compound score ≥ -0.5 → Sad
- Compound score < -0.5 → Angry

**User Experience**:
- Text input field with placeholder suggestions
- Real-time character count
- Analysis button with loading state
- Results with detailed breakdown (if available)
- Suggestions for improving analysis quality

### 2. Music Playlist Curation

#### 2.1 Spotify Integration
**Purpose**: Fetch and display playlists from Spotify based on detected mood.

**How It Works**:
1. System receives detected mood
2. Maps mood to search keywords (e.g., "Happy" → "happy upbeat energetic")
3. Authenticates with Spotify API using client credentials
4. Searches Spotify for playlists matching keywords
5. Returns top 20 playlists with metadata

**Playlist Data Returned**:
- Playlist ID
- Name
- Description
- Cover image URL
- Spotify URL
- Track count
- Owner/creator name

**Mood-to-Keyword Mapping**:
- Happy: "happy upbeat energetic"
- Sad: "sad melancholic emotional"
- Angry: "intense aggressive powerful"
- Neutral: "calm peaceful ambient"
- Surprised: "surprising unexpected dynamic"
- Fear: "dark atmospheric suspenseful"
- Disgust: "intense heavy aggressive"
- Calm: "peaceful relaxing meditative"

**User Experience**:
- Dedicated Spotify tab in results page
- Grid layout with playlist cards
- Click to open in Spotify (web or app)
- Save to favorites functionality
- Loading states and error handling

#### 2.2 YouTube Integration
**Purpose**: Fetch and display playlists from YouTube based on detected mood.

**How It Works**:
1. System receives detected mood
2. Maps mood to search keywords
3. Uses YouTube Data API v3 to search for playlists
4. Returns top 20 playlists with metadata

**Playlist Data Returned**:
- Playlist ID
- Title
- Description
- Thumbnail image URL
- YouTube URL
- Channel name

**User Experience**:
- Dedicated YouTube tab in results page
- Grid layout with playlist cards
- Click to open in YouTube
- Save to favorites functionality
- Loading states and error handling

### 3. User Account & Authentication

#### 3.1 User Registration
**Purpose**: Create user accounts for personalized experience and data persistence.

**Features**:
- Email and password registration
- Password hashing with bcryptjs
- Email validation
- Duplicate email prevention
- JWT token generation upon registration

**Data Collected**:
- Name
- Email (unique)
- Password (hashed)

#### 3.2 User Login
**Purpose**: Authenticate existing users and provide access to personalized features.

**Features**:
- Email/password authentication
- JWT token generation
- Secure cookie-based session management
- "Remember me" functionality (optional)
- Error handling for invalid credentials

#### 3.3 User Preferences
**Purpose**: Allow users to customize their experience.

**Customizable Settings**:
- **Preferred Platform**: Default to Spotify or YouTube
- **Theme**: Dark mode (currently only dark theme available)
- **Notification Preferences**: (Future feature)

**Storage**: Stored in user profile in MongoDB

### 4. Mood History & Analytics

#### 4.1 Mood Logging
**Purpose**: Track and store all mood detections for historical analysis.

**Data Stored**:
- User ID
- Detected mood
- Detection method (face or text)
- Timestamp
- Confidence score (optional)

**Automatic Logging**:
- Every mood detection is automatically logged
- Only logged for authenticated users
- No manual entry required

#### 4.2 Mood History Timeline
**Purpose**: Display chronological history of mood detections.

**Features**:
- Chronological list of all mood detections
- Filter by date range
- Filter by detection method
- Visual indicators for different moods
- Timestamp display

**User Experience**:
- Scrollable timeline interface
- Color-coded mood indicators
- Date grouping
- Quick access to playlists from historical moods

#### 4.3 Mood Statistics
**Purpose**: Provide insights into emotional patterns over time.

**Analytics Provided**:
- Most common mood
- Mood distribution (pie chart or bar chart)
- Mood trends over time (line chart)
- Detection method breakdown
- Time-based patterns (e.g., morning vs. evening moods)

**Visualizations**:
- Interactive charts using Chart.js
- Exportable data (future feature)
- Time period selection (week, month, year)

### 5. Favorites Management

#### 5.1 Save to Favorites
**Purpose**: Allow users to save playlists they like for quick access.

**Features**:
- One-click save from playlist results
- Duplicate prevention
- Platform identification (Spotify/YouTube)
- Mood tag association
- Visual feedback on save

**Data Stored**:
- User ID
- Song/Playlist name
- Artist/Creator name
- Platform (Spotify/YouTube)
- Mood tag
- URL
- Image URL
- Timestamp

#### 5.2 View Favorites
**Purpose**: Display all saved playlists in one place.

**Features**:
- Grid or list view
- Filter by platform
- Filter by mood
- Sort by date added
- Quick access to playlists
- Remove from favorites

**User Experience**:
- Dedicated favorites page
- Search functionality (future feature)
- Bulk actions (future feature)

### 6. User Interface & Design

#### 6.1 Design System
**Theme**: Futuristic dark theme with glowing animations

**Color Palette**:
- Primary background: Dark (#0a0a0a or similar)
- Accent colors: Mood-based gradients
  - Happy: Yellow gradients
  - Sad: Blue gradients
  - Angry: Red gradients
  - Neutral: Gray gradients
  - Surprised: Purple gradients
  - Fear: Orange gradients
  - Calm: Cyan gradients

**Typography**:
- Modern, clean sans-serif fonts
- Clear hierarchy
- Readable contrast ratios

**Animations**:
- Framer Motion for smooth transitions
- Glowing effects on interactive elements
- Loading animations
- Page transitions

#### 6.2 Responsive Design
**Breakpoints**:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Adaptations**:
- Mobile-first approach
- Touch-friendly buttons
- Optimized layouts for all screen sizes
- Camera access optimized for mobile

#### 6.3 Navigation
**Main Navigation**:
- Dashboard (home)
- Detect Mood
- History
- Favorites
- Settings
- Analytics (future)

**User Menu**:
- Profile
- Logout

---

## How It Works

### High-Level System Flow

```
User → Frontend → Backend API → ML Service
                ↓
            MongoDB (Data Storage)
                ↓
        External APIs (Spotify/YouTube)
```

### Detailed Workflow

#### Mood Detection Flow (Face)

1. **User Action**: User navigates to "Detect Mood" page
2. **Camera Access**: Browser requests camera permission
3. **Image Capture**: User clicks capture button
4. **Image Processing**: Frontend converts image to base64
5. **API Request**: Frontend sends POST request to ML service `/detect-emotion`
6. **ML Processing**:
   - Decode base64 image
   - Check face quality
   - Preprocess image (histogram equalization, blur)
   - Run ensemble emotion detection (multiple DeepFace models)
   - Calculate confidence scores
   - Map emotion to mood label
7. **Response**: ML service returns mood, confidence, suggestions
8. **Mood Logging**: Frontend sends mood to backend `/api/moods` (if authenticated)
9. **Playlist Fetch**: Frontend requests playlists from backend
10. **Backend Processing**:
    - Authenticates with Spotify/YouTube APIs
    - Searches for playlists using mood keywords
    - Returns playlist data
11. **Display Results**: Frontend displays playlists in results page

#### Mood Detection Flow (Text)

1. **User Action**: User types text in input field
2. **Text Submission**: User clicks "Analyze" button
3. **API Request**: Frontend sends POST request to ML service `/detect-sentiment`
4. **ML Processing**:
   - Validate text length (minimum 3 words)
   - Run VADER sentiment analysis
   - Run TextBlob analysis
   - Extract emotion keywords
   - Combine analyses with weighted scores
   - Map to mood label
   - Calculate confidence
5. **Response**: ML service returns mood, confidence, analysis details
6. **Mood Logging**: Frontend sends mood to backend `/api/moods` (if authenticated)
7. **Playlist Fetch**: Same as face detection flow
8. **Display Results**: Frontend displays playlists

#### Playlist Retrieval Flow

1. **Mood Detected**: System has mood label (e.g., "Happy")
2. **Keyword Mapping**: Backend maps mood to search keywords
3. **Platform Selection**: User selects Spotify or YouTube tab
4. **API Authentication**:
   - **Spotify**: Client credentials flow (client ID + secret)
   - **YouTube**: API key authentication
5. **Search Execution**:
   - **Spotify**: Search API with keyword query, type=playlist, limit=20
   - **YouTube**: Search API with keyword query, type=playlist, maxResults=20
6. **Data Processing**: Backend formats playlist data
7. **Response**: Backend returns JSON with playlists array
8. **Display**: Frontend renders playlist cards in grid layout

---

## User Flows

### Flow 1: New User - First Mood Detection

1. User visits homepage
2. Clicks "Get Started" or "Detect Mood"
3. Redirected to login/signup
4. Creates account (name, email, password)
5. Automatically logged in
6. Redirected to Detect Mood page
7. Chooses detection method (face or text)
8. **If Face**:
   - Grants camera permission
   - Sees camera preview
   - Clicks capture
   - Waits for analysis (2-5 seconds)
   - Sees detected mood with confidence
9. **If Text**:
   - Types description of feelings
   - Clicks "Analyze"
   - Waits for analysis (1-2 seconds)
   - Sees detected mood with confidence
10. Automatically redirected to Results page
11. Sees playlists from Spotify and YouTube
12. Can browse playlists, save favorites, or detect mood again

### Flow 2: Returning User - Quick Mood Check

1. User logs in
2. Goes directly to Detect Mood page
3. Uses preferred method (face or text)
4. Gets mood detection
5. Views playlists
6. Saves favorite playlist
7. Checks mood history to see pattern

### Flow 3: Mood History Analysis

1. User navigates to History page
2. Sees timeline of all mood detections
3. Clicks on a past mood entry
4. Views playlists that were recommended for that mood
5. Can save any playlist to favorites
6. Views analytics/statistics page
7. Sees mood distribution chart
8. Identifies patterns (e.g., "I'm usually happy in the mornings")

### Flow 4: Favorites Management

1. User views playlist results
2. Clicks star icon on a playlist
3. Playlist saved to favorites
4. Navigates to Favorites page
5. Sees all saved playlists
6. Filters by platform or mood
7. Clicks playlist to open in Spotify/YouTube
8. Removes playlist from favorites if desired

---

## Technical Architecture

### System Architecture

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
│   Port: 3000    │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│   Backend API   │
│   (Express)     │
│   Port: 5000    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐  ┌──▼────────┐
│  ML   │  │ MongoDB   │
│Service│  │  Atlas    │
│Port:  │  │           │
│ 5001  │  └───────────┘
└───┬───┘
    │
┌───▼──────────┐
│ External APIs│
│ - Spotify    │
│ - YouTube    │
└──────────────┘
```

### Frontend Architecture

**Framework**: Next.js 14 (App Router)
**Language**: TypeScript
**Styling**: Tailwind CSS
**State Management**: React Context API
**HTTP Client**: Axios
**Animations**: Framer Motion
**Charts**: Chart.js

**Key Components**:
- `AuthContext`: Manages user authentication state
- `Navbar`: Navigation component
- `DetectMoodPage`: Mood detection interface
- `ResultsPage`: Playlist display
- `HistoryPage`: Mood history timeline
- `DashboardPage`: User dashboard
- `SettingsPage`: User preferences

### Backend Architecture

**Framework**: Express.js
**Language**: JavaScript (Node.js)
**Database**: MongoDB with Mongoose ODM
**Authentication**: JWT (JSON Web Tokens)
**Password Hashing**: bcryptjs
**HTTP Client**: Axios

**Key Modules**:
- `routes/auth.js`: Authentication endpoints
- `routes/moods.js`: Mood logging and history
- `routes/playlists.js`: Spotify/YouTube integration
- `routes/favorites.js`: Favorites management
- `routes/users.js`: User preferences
- `middleware/auth.js`: JWT verification
- `models/User.js`: User schema
- `models/MoodLog.js`: Mood log schema
- `models/Favorite.js`: Favorite schema

### ML Service Architecture

**Framework**: Flask
**Language**: Python 3.8+
**Libraries**:
- DeepFace: Facial emotion recognition
- VADER Sentiment: Text sentiment analysis
- TextBlob: Additional sentiment analysis
- OpenCV: Image processing
- PIL: Image manipulation
- NumPy: Numerical operations

**Key Functions**:
- `detect_emotion_ensemble()`: Multi-model face emotion detection
- `preprocess_image()`: Image enhancement
- `detect_face_quality()`: Face validation
- `analyze_text_context()`: Keyword extraction
- `sentiment_to_mood()`: Sentiment score mapping

### Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password_hash: String,
  preferences: {
    platform: String, // "spotify" | "youtube"
    theme: String      // "dark"
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### MoodLogs Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (indexed, ref: User),
  mood: String, // "Happy" | "Sad" | "Angry" | etc.
  detection_method: String, // "face" | "text"
  confidence: Number, // 0-1 (optional)
  timestamp: Date (indexed),
  createdAt: Date
}
```

#### Favorites Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (indexed, ref: User),
  song_name: String,
  artist: String,
  platform: String, // "spotify" | "youtube"
  mood_tag: String,
  song_url: String,
  image_url: String,
  createdAt: Date
}
```

### API Communication

**Frontend ↔ Backend**:
- Base URL: `http://localhost:5000` (dev) / Production URL (prod)
- Authentication: JWT tokens in cookies
- CORS: Enabled for frontend origin

**Backend ↔ ML Service**:
- Base URL: `http://localhost:5001` (dev) / Production URL (prod)
- No authentication required (internal service)
- CORS: Enabled

**Backend ↔ External APIs**:
- **Spotify**: `https://api.spotify.com/v1`
- **YouTube**: `https://www.googleapis.com/youtube/v3`
- Authentication: API keys / OAuth tokens

---

## Data Models

### User Model
```javascript
{
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
    required: true
  },
  preferences: {
    platform: {
      type: String,
      enum: ['spotify', 'youtube'],
      default: 'spotify'
    },
    theme: {
      type: String,
      enum: ['dark'],
      default: 'dark'
    }
  }
}
```

### MoodLog Model
```javascript
{
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
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
  confidence: {
    type: Number,
    min: 0,
    max: 1
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}
```

### Favorite Model
```javascript
{
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  song_name: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['spotify', 'youtube']
  },
  mood_tag: {
    type: String,
    required: true
  },
  song_url: {
    type: String,
    required: true
  },
  image_url: String
}
```

---

## API Specifications

### Authentication Endpoints

#### POST `/api/auth/signup`
**Purpose**: Create a new user account

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response** (201 Created):
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses**:
- 400: Validation error (missing fields, invalid email)
- 409: Email already exists

#### POST `/api/auth/login`
**Purpose**: Authenticate existing user

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response** (200 OK):
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses**:
- 401: Invalid credentials

#### GET `/api/auth/me`
**Purpose**: Get current authenticated user

**Headers**: `Cookie: token=jwt_token_here`

**Response** (200 OK):
```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "preferences": {
    "platform": "spotify",
    "theme": "dark"
  }
}
```

**Error Responses**:
- 401: Not authenticated

### Mood Endpoints

#### POST `/api/moods`
**Purpose**: Log a mood detection

**Headers**: `Cookie: token=jwt_token_here`

**Request Body**:
```json
{
  "mood": "Happy",
  "detectionMethod": "face",
  "confidence": 0.85
}
```

**Response** (201 Created):
```json
{
  "id": "mood_log_id",
  "mood": "Happy",
  "detectionMethod": "face",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### GET `/api/moods/history`
**Purpose**: Get user's mood history

**Headers**: `Cookie: token=jwt_token_here`

**Query Parameters**:
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset (default: 0)
- `method`: Filter by detection method ("face" | "text")
- `startDate`: ISO date string
- `endDate`: ISO date string

**Response** (200 OK):
```json
{
  "moods": [
    {
      "id": "mood_log_id",
      "mood": "Happy",
      "detectionMethod": "face",
      "confidence": 0.85,
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 100,
  "limit": 50,
  "offset": 0
}
```

#### GET `/api/moods/stats`
**Purpose**: Get mood statistics

**Headers**: `Cookie: token=jwt_token_here`

**Query Parameters**:
- `period`: "week" | "month" | "year" | "all" (default: "all")

**Response** (200 OK):
```json
{
  "totalDetections": 150,
  "mostCommonMood": "Happy",
  "moodDistribution": {
    "Happy": 45,
    "Sad": 20,
    "Neutral": 30,
    "Angry": 10,
    "Calm": 25,
    "Surprised": 10,
    "Fear": 5,
    "Disgust": 5
  },
  "methodBreakdown": {
    "face": 80,
    "text": 70
  }
}
```

### Playlist Endpoints

#### GET `/api/playlists/spotify/:mood`
**Purpose**: Get Spotify playlists for a mood

**Headers**: `Cookie: token=jwt_token_here` (optional, for logging)

**URL Parameters**:
- `mood`: Mood label (e.g., "Happy", "Sad")

**Response** (200 OK):
```json
{
  "playlists": [
    {
      "id": "playlist_id",
      "name": "Happy Hits",
      "description": "Upbeat songs to lift your mood",
      "image_url": "https://...",
      "url": "https://open.spotify.com/playlist/...",
      "tracks_count": 50,
      "owner": "Spotify"
    }
  ],
  "mood": "Happy"
}
```

**Error Responses**:
- 500: Spotify API error (invalid credentials, network error)

#### GET `/api/playlists/youtube/:mood`
**Purpose**: Get YouTube playlists for a mood

**Headers**: `Cookie: token=jwt_token_here` (optional)

**URL Parameters**:
- `mood`: Mood label (e.g., "Happy", "Sad")

**Response** (200 OK):
```json
{
  "playlists": [
    {
      "id": "playlist_id",
      "name": "Happy Music Mix",
      "description": "Best happy songs",
      "image_url": "https://...",
      "url": "https://www.youtube.com/playlist?list=...",
      "channel": "Music Channel"
    }
  ],
  "mood": "Happy"
}
```

### Favorites Endpoints

#### POST `/api/favorites`
**Purpose**: Add playlist to favorites

**Headers**: `Cookie: token=jwt_token_here`

**Request Body**:
```json
{
  "song_name": "Happy Hits",
  "artist": "Spotify",
  "platform": "spotify",
  "mood_tag": "Happy",
  "song_url": "https://open.spotify.com/playlist/...",
  "image_url": "https://..."
}
```

**Response** (201 Created):
```json
{
  "id": "favorite_id",
  "song_name": "Happy Hits",
  "artist": "Spotify",
  "platform": "spotify",
  "mood_tag": "Happy",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses**:
- 400: Duplicate favorite (already exists)
- 401: Not authenticated

#### GET `/api/favorites`
**Purpose**: Get user's favorites

**Headers**: `Cookie: token=jwt_token_here`

**Query Parameters**:
- `platform`: Filter by platform ("spotify" | "youtube")
- `mood`: Filter by mood tag

**Response** (200 OK):
```json
{
  "favorites": [
    {
      "id": "favorite_id",
      "song_name": "Happy Hits",
      "artist": "Spotify",
      "platform": "spotify",
      "mood_tag": "Happy",
      "song_url": "https://...",
      "image_url": "https://...",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### DELETE `/api/favorites/:id`
**Purpose**: Remove favorite

**Headers**: `Cookie: token=jwt_token_here`

**Response** (200 OK):
```json
{
  "message": "Favorite removed successfully"
}
```

### User Endpoints

#### GET `/api/users/preferences`
**Purpose**: Get user preferences

**Headers**: `Cookie: token=jwt_token_here`

**Response** (200 OK):
```json
{
  "platform": "spotify",
  "theme": "dark"
}
```

#### PUT `/api/users/preferences`
**Purpose**: Update user preferences

**Headers**: `Cookie: token=jwt_token_here`

**Request Body**:
```json
{
  "platform": "youtube",
  "theme": "dark"
}
```

**Response** (200 OK):
```json
{
  "platform": "youtube",
  "theme": "dark"
}
```

### ML Service Endpoints

#### POST `/detect-emotion`
**Purpose**: Detect emotion from facial image

**Request Body**:
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response** (200 OK):
```json
{
  "emotion": "Happy",
  "confidence": 0.85,
  "all_emotions": {
    "happy": 85.2,
    "sad": 5.1,
    "angry": 2.3,
    "neutral": 4.2,
    "surprise": 2.1,
    "fear": 0.8,
    "disgust": 0.3
  },
  "suggestion": "Great mood detected! Perfect for upbeat playlists.",
  "quality": "Good"
}
```

**Error Responses**:
- 400: No image provided, invalid image data, poor quality
- 500: ML processing error

#### POST `/detect-sentiment`
**Purpose**: Detect mood from text

**Request Body**:
```json
{
  "text": "I'm feeling really happy today! Everything is going great."
}
```

**Response** (200 OK):
```json
{
  "mood": "Happy",
  "confidence": 0.92,
  "vader_scores": {
    "compound": 0.85,
    "pos": 0.65,
    "neu": 0.25,
    "neg": 0.10
  },
  "textblob_polarity": 0.8,
  "textblob_subjectivity": 0.75,
  "keyword_matches": {
    "happy": 0.1
  },
  "suggestion": "Positive vibes detected! Confidence: 92.0%",
  "analysis_quality": "High"
}
```

**Error Responses**:
- 400: No text provided, text too short
- 500: Analysis error

#### GET `/health`
**Purpose**: Health check endpoint

**Response** (200 OK):
```json
{
  "status": "ok"
}
```

---

## User Interface & Experience

### Page Descriptions

#### 1. Homepage / Dashboard
**Purpose**: Landing page and user dashboard

**Elements**:
- Hero section with product description
- "Get Started" / "Detect Mood" CTA button
- Quick stats (if logged in): Total detections, most common mood
- Recent mood history preview
- Navigation to all features

**User Actions**:
- Navigate to mood detection
- View history
- Access settings
- Logout

#### 2. Detect Mood Page
**Purpose**: Primary interaction point for mood detection

**Layout**:
- Two tabs or buttons: "Face Detection" and "Text Analysis"
- **Face Detection Tab**:
  - Camera preview area
  - Capture button
  - Instructions: "Position your face in the frame and click capture"
  - Processing indicator
  - Results display area
- **Text Analysis Tab**:
  - Large text input field
  - Placeholder: "Describe how you're feeling..."
  - Character counter
  - Analyze button
  - Processing indicator
  - Results display area

**User Flow**:
1. Select detection method
2. Provide input (face or text)
3. Wait for processing (2-5 seconds)
4. See results with confidence
5. Automatic redirect to results page

#### 3. Results Page
**Purpose**: Display playlists matching detected mood

**Layout**:
- Mood indicator at top (color-coded)
- Two tabs: "Spotify" and "YouTube"
- Grid of playlist cards
- Each card shows:
  - Cover image
  - Playlist name
  - Description/creator
  - Track count (Spotify)
  - Save to favorites button (star icon)
  - Click to open playlist

**User Actions**:
- Switch between Spotify and YouTube
- Click playlist to open in external platform
- Save playlist to favorites
- Detect mood again
- View history

#### 4. History Page
**Purpose**: Display mood detection history

**Layout**:
- Timeline view (vertical or horizontal)
- Each entry shows:
  - Date and time
  - Detected mood (with color indicator)
  - Detection method icon
  - Confidence score
  - Click to view playlists for that mood
- Filter options:
  - Date range picker
  - Detection method filter
  - Mood filter
- Statistics section:
  - Most common mood
  - Total detections
  - Mood distribution chart

**User Actions**:
- Scroll through history
- Filter by date/method/mood
- Click entry to view playlists
- View analytics

#### 5. Favorites Page
**Purpose**: Display saved playlists

**Layout**:
- Grid or list view of favorite playlists
- Each item shows:
  - Cover image
  - Playlist name
  - Platform badge
  - Mood tag
  - Date saved
  - Remove button
- Filter options:
  - Platform filter
  - Mood filter
  - Sort options

**User Actions**:
- View all favorites
- Filter and sort
- Open playlist
- Remove from favorites

#### 6. Settings Page
**Purpose**: User preferences and account management

**Layout**:
- User profile section:
  - Name display
  - Email display
- Preferences section:
  - Preferred platform dropdown
  - Theme selector (currently only dark)
- Account actions:
  - Change password (future)
  - Delete account (future)

**User Actions**:
- Update preferences
- Save changes

#### 7. Login / Signup Pages
**Purpose**: User authentication

**Layout**:
- Form with:
  - Email input
  - Password input
  - Name input (signup only)
  - Submit button
  - Link to switch between login/signup
- Error message display area

**User Actions**:
- Enter credentials
- Submit form
- Switch between login and signup
- Navigate to homepage after authentication

### Design Principles

1. **Simplicity**: Clean, uncluttered interface
2. **Clarity**: Clear labels and instructions
3. **Feedback**: Visual feedback for all actions
4. **Consistency**: Uniform design patterns throughout
5. **Accessibility**: High contrast, readable fonts, keyboard navigation
6. **Performance**: Fast loading, smooth animations
7. **Responsiveness**: Works on all device sizes

### Animation Guidelines

- **Page Transitions**: Smooth fade/slide transitions
- **Button Interactions**: Hover effects, click feedback
- **Loading States**: Spinner or skeleton screens
- **Success Feedback**: Brief success message or animation
- **Error Feedback**: Clear error messages with retry options

---

## Performance Requirements

### Response Times
- **Mood Detection (Face)**: < 5 seconds
- **Mood Detection (Text)**: < 2 seconds
- **Playlist Fetching**: < 3 seconds per platform
- **Page Load**: < 2 seconds
- **API Response**: < 1 second (excluding external APIs)

### Scalability
- Support 100+ concurrent users
- Handle 1000+ mood detections per day
- Efficient database queries with proper indexing
- Caching for frequently accessed data (future)

### Reliability
- 99% uptime target
- Graceful error handling
- Fallback mechanisms for API failures
- Data backup and recovery

### Optimization
- Image compression for camera captures
- Lazy loading for playlist images
- Code splitting in frontend
- Database query optimization
- API response caching (future)

---

## Security & Privacy

### Authentication Security
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure token generation and validation
- **Session Management**: HTTP-only cookies
- **Token Expiration**: Configurable expiration time

### Data Privacy
- **Password Storage**: Never stored in plain text
- **User Data**: Encrypted in transit (HTTPS)
- **Image Data**: Not stored permanently (only processed)
- **Mood Data**: Stored securely, user can delete
- **GDPR Compliance**: User data deletion capability (future)

### API Security
- **CORS**: Restricted to frontend origin
- **Rate Limiting**: Prevent abuse (future)
- **Input Validation**: All inputs validated and sanitized
- **Error Messages**: No sensitive information in errors

### External API Security
- **API Keys**: Stored in environment variables
- **Credentials**: Never exposed to frontend
- **Token Rotation**: Support for credential updates

---

## Future Enhancements

### Phase 2 Features

1. **Personalized Daily Playlists**
   - AI-generated playlists based on mood history
   - Time-based recommendations (morning, evening)
   - Learning from user preferences

2. **Spotify OAuth Integration**
   - Direct Spotify account connection
   - Sync listening history
   - Create playlists directly in Spotify
   - Access user's saved playlists

3. **Multi-Language Support**
   - Sentiment analysis in multiple languages
   - Localized UI
   - Regional music recommendations

4. **AI Chatbot for Mood Conversation**
   - Conversational mood detection
   - Contextual follow-up questions
   - More accurate mood assessment through dialogue

5. **Real-Time Mood Tracking**
   - Continuous mood monitoring
   - Mood changes throughout the day
   - Automatic playlist updates

6. **Social Features**
   - Share playlists with friends
   - Mood-based social feed
   - Collaborative playlists
   - Friend mood comparisons (anonymized)

7. **Advanced Analytics**
   - Mood correlation analysis
   - Time-of-day patterns
   - Music genre preferences by mood
   - Exportable reports

8. **Mobile App**
   - React Native mobile application
   - Native camera integration
   - Push notifications for mood reminders
   - Offline mode

9. **Voice-Based Mood Detection**
   - Analyze voice tone and sentiment
   - Third mood detection method
   - More natural interaction

10. **Music Player Integration**
    - In-app music player (for supported platforms)
    - Preview tracks before saving
    - Queue management

### Technical Improvements

1. **Caching Layer**
   - Redis for session management
   - Cache playlist results
   - Reduce API calls

2. **Background Jobs**
   - Queue system for ML processing
   - Scheduled mood reminders
   - Daily playlist generation

3. **Monitoring & Analytics**
   - Application performance monitoring
   - Error tracking (Sentry)
   - User analytics
   - API usage metrics

4. **Testing**
   - Unit tests for all components
   - Integration tests for APIs
   - E2E tests for user flows
   - ML model accuracy testing

5. **Documentation**
   - API documentation (Swagger/OpenAPI)
   - Developer guide
   - Deployment guides
   - User tutorials

---

## Success Metrics

### User Engagement
- Daily active users (DAU)
- Mood detections per user per week
- Average session duration
- Return user rate

### Feature Usage
- Face vs. text detection ratio
- Spotify vs. YouTube preference
- Favorites saved per user
- History page visits

### Technical Performance
- API response times
- Error rates
- Uptime percentage
- ML model accuracy

### Business Metrics (Future)
- User retention rate
- Premium subscription conversion (if applicable)
- User satisfaction scores
- Feature adoption rates

---

## Conclusion

The **AI Music Mood Matcher** is a comprehensive platform that combines cutting-edge AI technology with music streaming services to create a unique, personalized music discovery experience. By detecting emotions through facial recognition or text analysis and automatically curating playlists, the product solves a real user need while providing an engaging, modern user experience.

The product is designed with scalability, security, and user experience in mind, with a clear roadmap for future enhancements that will further improve the value proposition for users.

---

**Document Version**: 1.0.0  
**Last Updated**: 2024  
**Maintained By**: Development Team

