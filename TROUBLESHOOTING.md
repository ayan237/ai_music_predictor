# Troubleshooting Guide

## Common Errors and Solutions

### 500 Internal Server Error on Signup/Login

**Possible Causes:**
1. **MongoDB Connection Issue**
   - Check if MongoDB is running
   - Verify `MONGODB_URI` in `backend/.env` is correct
   - Check backend console for connection errors

2. **Missing Environment Variables**
   - Ensure `JWT_SECRET` is set in `backend/.env`
   - Check that `MONGODB_URI` is properly formatted

3. **Database Schema Validation**
   - Check backend console for specific error messages
   - Verify user data format matches schema

**How to Debug:**
1. Check backend terminal for error logs
2. Look for "MongoDB connection error" messages
3. Check if the error message shows specific validation issues

**Quick Fix:**
```bash
# Check backend .env file
cat backend/.env

# Restart backend server
cd backend
npm run dev
```

### Favicon 404 Error

This is a non-critical error. The favicon has been added to fix this.

### Extension Context Invalidated

This is a browser extension issue, not related to your app. You can ignore it.

### Fast Refresh Rebuilding

This is normal Next.js behavior during development. Not an error.

## Debugging Steps

1. **Check Backend Logs**
   - Look at the terminal where backend is running
   - Check for MongoDB connection messages
   - Look for specific error stack traces

2. **Check Frontend Console**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab to see API request/response

3. **Verify Environment Variables**
   ```bash
   # Backend
   cat backend/.env
   
   # Frontend  
   cat frontend/.env.local
   ```

4. **Test API Endpoints**
   ```bash
   # Health check
   curl http://localhost:5000/health
   
   # Test signup (replace with your data)
   curl -X POST http://localhost:5000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","password":"test123"}'
   ```

## Common Issues

### MongoDB Connection String Format
```
✅ Correct: mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority
❌ Wrong: mongodb://user:pass@cluster.mongodb.net/dbname
```

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Default: `http://localhost:3000`

### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F
```

