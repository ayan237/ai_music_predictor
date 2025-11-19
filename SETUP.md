# Setup Guide

## Environment Variables

### Backend Environment Variables

Create a file `backend/.env` with the following content:

```env
PORT=5000
ML_SERVICE_URL=http://localhost:5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moodmatcher?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
YOUTUBE_API_KEY=your-youtube-api-key
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend Environment Variables

Create a file `frontend/.env.local` with the following content:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:5001
```

## Quick Setup Commands

### Windows PowerShell

```powershell
# Backend .env
@"
PORT=5000
ML_SERVICE_URL=http://localhost:5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moodmatcher?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
YOUTUBE_API_KEY=your-youtube-api-key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
"@ | Out-File -FilePath backend\.env -Encoding utf8

# Frontend .env.local
@"
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:5001
"@ | Out-File -FilePath frontend\.env.local -Encoding utf8
```

### Linux/Mac

```bash
# Backend .env
cat > backend/.env << EOF
PORT=5000
ML_SERVICE_URL=http://localhost:5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moodmatcher?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
YOUTUBE_API_KEY=your-youtube-api-key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
EOF

# Frontend .env.local
cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:5001
EOF
```

