# Quick Start Guide 🚀

Get the AI Music Mood Matcher up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
# Install all dependencies
npm run install:all

# Or install individually:
cd frontend && npm install
cd ../backend && npm install
cd ../ml-service && pip install -r requirements.txt
```

## Step 2: Set Up Environment Variables

### Backend
1. Copy `backend/.env.example` to `backend/.env`
2. Fill in your MongoDB connection string
3. Add your Spotify and YouTube API keys (optional for testing)

```bash
cd backend
cp .env.example .env
# Edit .env with your values
```

### Frontend
1. Copy `frontend/.env.example` to `frontend/.env.local`
2. Default values should work for local development

```bash
cd frontend
cp .env.example .env.local
```

## Step 3: Start Services

Open 3 terminal windows:

**Terminal 1 - ML Service:**
```bash
cd ml-service
python app.py
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

## Step 4: Access the App

Open your browser and go to: `http://localhost:3000`

## First Run Notes

- The ML service will download DeepFace models on first run (may take a few minutes)
- You can test without API keys, but playlist features won't work
- Create an account to start detecting moods!

## Troubleshooting

### ML Service won't start
- Ensure Python 3.8+ is installed
- Check that all requirements are installed: `pip install -r requirements.txt`
- On first run, DeepFace downloads models automatically

### Backend connection errors
- Verify MongoDB connection string is correct
- Check that backend is running on port 5000
- Ensure ML service is running before backend

### Frontend can't connect
- Check that backend is running
- Verify `.env.local` has correct API URLs
- Check browser console for CORS errors

### Webcam not working
- Grant browser permissions for camera
- Use HTTPS in production (required for webcam access)
- Try a different browser if issues persist

## Testing Without API Keys

You can test the app without Spotify/YouTube API keys:
- Mood detection will work
- Playlist fetching will show error messages
- All other features work normally

## Next Steps

1. Get API keys from Spotify and YouTube (see README.md)
2. Set up MongoDB Atlas for production
3. Deploy to Vercel (frontend) and Render/Railway (backend + ML)

Happy mood matching! 🎵

