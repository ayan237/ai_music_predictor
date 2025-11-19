# AI Music Mood Matcher 🎵

An AI-powered web application that detects your current mood using facial emotion recognition or text-based sentiment analysis, then curates personalized playlists from Spotify and YouTube to match your emotional state.

## Features ✨

- **Dual Mood Detection**
  - 🎭 Face-based emotion recognition using DeepFace
  - 📝 Text-based sentiment analysis using VADER and TextBlob
  
- **Music Recommendations**
  - 🎵 Spotify playlist integration
  - ▶️ YouTube playlist integration
  
- **User Features**
  - 📊 Mood history timeline with interactive charts
  - ⭐ Save favorite songs and playlists
  - ⚙️ Customizable preferences (platform, theme)
  - 🔐 Secure authentication with JWT

- **Modern UI/UX**
  - 🌌 Futuristic dark theme with glowing animations
  - 🎨 Smooth transitions and Framer Motion animations
  - 📱 Responsive design for all devices

## Tech Stack 🛠️

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Chart.js** - Data visualization
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### ML Service
- **Flask** - Python web framework
- **DeepFace** - Facial emotion recognition
- **VADER Sentiment** - Text sentiment analysis
- **TextBlob** - Additional sentiment analysis

## Project Structure 📁

```
song_predictor/
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js app router pages
│   ├── components/   # React components
│   └── contexts/     # React contexts
├── backend/          # Node.js/Express backend API
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   └── middleware/   # Express middleware
├── ml-service/       # Flask ML microservice
│   └── app.py        # Flask application
└── README.md
```

## Setup Instructions 🚀

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- MongoDB Atlas account (or local MongoDB)
- Spotify API credentials
- YouTube API key

### 1. Clone and Install

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Install ML service dependencies
cd ../ml-service
pip install -r requirements.txt
```

### 2. Environment Variables

#### Backend (.env in backend/)
```env
PORT=5000
ML_SERVICE_URL=http://localhost:5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moodmatcher
JWT_SECRET=your-super-secret-jwt-key
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
YOUTUBE_API_KEY=your-youtube-api-key
NODE_ENV=development
```

#### Frontend (.env.local in frontend/)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:5001
```

### 3. Get API Keys

#### Spotify API
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Copy Client ID and Client Secret

#### YouTube API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable YouTube Data API v3
3. Create credentials (API Key)
4. Copy the API key

#### MongoDB Atlas
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Replace username and password in connection string

### 4. Run the Application

#### Terminal 1 - ML Service
```bash
cd ml-service
python app.py
```
Service runs on `http://localhost:5001`

#### Terminal 2 - Backend
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

#### Terminal 3 - Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000`

## Usage 📖

1. **Sign Up/Login**: Create an account or sign in
2. **Detect Mood**: 
   - Choose face detection (requires webcam) or text input
   - Let AI analyze your emotion
3. **Browse Playlists**: View curated playlists from Spotify and YouTube
4. **Save Favorites**: Click the star icon to save playlists
5. **View History**: Check your mood timeline and saved favorites
6. **Customize**: Adjust preferences in Settings

## API Endpoints 🔌

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Moods
- `POST /api/moods` - Log mood detection
- `GET /api/moods/history` - Get mood history
- `GET /api/moods/stats` - Get mood statistics

### Playlists
- `GET /api/playlists/spotify/:mood` - Get Spotify playlists
- `GET /api/playlists/youtube/:mood` - Get YouTube playlists

### Favorites
- `POST /api/favorites` - Add to favorites
- `GET /api/favorites` - Get user favorites
- `DELETE /api/favorites/:id` - Remove favorite

### Users
- `GET /api/users/preferences` - Get preferences
- `PUT /api/users/preferences` - Update preferences

### ML Service
- `POST /detect-emotion` - Detect emotion from image
- `POST /detect-sentiment` - Detect mood from text

## Database Schema 📊

### Users
```javascript
{
  name: String,
  email: String (unique),
  password_hash: String,
  preferences: {
    platform: String,
    theme: String
  }
}
```

### Mood Logs
```javascript
{
  user_id: ObjectId,
  mood: String,
  detection_method: String,
  timestamp: Date
}
```

### Favorites
```javascript
{
  user_id: ObjectId,
  song_name: String,
  artist: String,
  platform: String,
  mood_tag: String,
  song_url: String,
  image_url: String
}
```

## Deployment 🌐

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Backend (Render/Railway)
1. Connect GitHub repository
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Add environment variables
5. Deploy

### ML Service (Render/Railway)
1. Create new service
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `python app.py`
4. Deploy

### MongoDB Atlas
- Already cloud-hosted, just update connection string

## Troubleshooting 🔧

### ML Service Issues
- Ensure DeepFace models are downloaded (first run may take time)
- Check Python version (3.8+ required)
- Install system dependencies for OpenCV if needed

### API Connection Issues
- Verify all environment variables are set
- Check CORS settings in backend
- Ensure ML service is running before starting backend

### Webcam Issues
- Grant browser permissions for camera access
- Use HTTPS in production (required for webcam)

## Future Enhancements 🚀

- [ ] Personalized daily mood-based playlists
- [ ] Spotify OAuth for syncing listening history
- [ ] Multi-language sentiment analysis
- [ ] AI chatbot for mood conversation
- [ ] Mobile app (React Native)
- [ ] Real-time mood tracking
- [ ] Social features (share playlists)

## License 📄

MIT License - feel free to use this project for learning and development!

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## Support 💬

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ by Ayan
