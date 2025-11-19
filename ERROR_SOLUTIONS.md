# Error Solutions Guide

## Current Errors and Solutions

### 1. ERR_CONNECTION_RESET on ML Service (port 5001)

**Error:** `POST http://localhost:5001/detect-emotion net::ERR_CONNECTION_RESET`

**Possible Causes:**
- ML service crashed while processing
- DeepFace model loading is taking too long
- Service is not running

**Solutions:**

1. **Check if ML service is running:**
   ```bash
   # In terminal where ML service should be running
   # You should see: "Starting ML Service on port 5001..."
   ```

2. **Restart ML service:**
   ```bash
   cd ml-service
   python app.py
   ```

3. **Check for errors in ML service terminal:**
   - Look for Python traceback errors
   - Check if DeepFace models are downloading (first run takes time)

4. **Test ML service directly:**
   ```bash
   curl http://localhost:5001/health
   # Should return: {"status":"ok"}
   ```

5. **If service keeps crashing:**
   - DeepFace might be running out of memory
   - Try using text sentiment analysis instead of face detection
   - Check Python terminal for specific error messages

### 2. 500 Error on Spotify Playlist API

**Error:** `GET http://localhost:5000/api/playlists/spotify/Happy 500 (Internal Server Error)`

**Possible Causes:**
- MongoDB not connected (auth middleware fails)
- Spotify API credentials missing or incorrect
- Spotify API authentication failed

**Solutions:**

1. **Check MongoDB Connection:**
   - Backend terminal should show: `MongoDB connected`
   - If not, fix MongoDB connection first (IP whitelist issue)

2. **Check Spotify API Credentials:**
   - Verify `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in `backend/.env`
   - Get credentials from: https://developer.spotify.com/dashboard

3. **Test Spotify API:**
   ```bash
   # Check backend terminal for specific error
   # Should show: "Spotify API authentication failed" or similar
   ```

4. **Common Spotify API Issues:**
   - Invalid Client ID or Secret
   - API not enabled in Spotify Dashboard
   - Rate limiting (wait a few minutes)

### 3. MongoDB Connection Still Failing

**If you've whitelisted but still getting errors:**

1. **Double-check whitelist:**
   - Go to MongoDB Atlas → Network Access
   - Ensure IP shows as "Active" (not "Pending")
   - If using `0.0.0.0/0`, make sure it's saved

2. **Wait longer:**
   - Changes can take up to 5 minutes to propagate
   - Wait 5 minutes, then restart backend

3. **Check connection string format:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```
   - Must use `mongodb+srv://` (not `mongodb://`)
   - Password must be URL-encoded if it has special characters

4. **Test connection string:**
   - Copy connection string from Atlas
   - Make sure username and password are correct
   - Try creating a new database user if needed

## Quick Fix Checklist

- [ ] ML Service running on port 5001? (Check terminal)
- [ ] Backend shows "MongoDB connected"? (Check terminal)
- [ ] Spotify credentials in `backend/.env`?
- [ ] YouTube API key in `backend/.env`?
- [ ] All services restarted after changes?

## Testing Each Service

### Test ML Service:
```bash
curl http://localhost:5001/health
```

### Test Backend:
```bash
curl http://localhost:5000/health
```

### Test Spotify API (if credentials set):
```bash
curl http://localhost:5000/api/playlists/spotify/Happy
# (Requires authentication token)
```

## Next Steps

1. **Check backend terminal** - Look for specific error messages
2. **Check ML service terminal** - Look for Python errors
3. **Share the exact error messages** from both terminals
4. **Try text sentiment analysis** instead of face detection (works without ML service issues)

The improved error handling will now show more specific error messages to help debug!

