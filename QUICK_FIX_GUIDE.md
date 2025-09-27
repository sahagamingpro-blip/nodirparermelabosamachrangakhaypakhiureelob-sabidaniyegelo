# 🚀 Quick Fix Guide - Captcha Issue

## ✅ **Current Status**
- ✅ **Backend API is working** - Both `/api/test-captcha` and `/api/captcha` return proper JSON
- ✅ **Server is running** on port 3000
- ✅ **SVG captcha generation** is working (Canvas fallback implemented)
- ✅ **MySQL connection** is configured

## 🎯 **Quick Test Steps**

### **Step 1: Open Browser Console**
1. Open your browser (Chrome/Firefox)
2. Press `F12` to open DevTools
3. Go to **Console** tab

### **Step 2: Visit Registration Page**
1. Go to: `http://localhost:3000/auth`
2. Click on **Register** tab
3. Look for console logs starting with "Loading captcha..."

### **Step 3: Check Network Tab**
1. In DevTools, go to **Network** tab
2. Refresh the page
3. Look for `/api/captcha` request
4. Check if it returns JSON or HTML

## 🔍 **Expected Console Output**

### **Success Case:**
```
Loading captcha...
Captcha response status: 200
Captcha response headers: application/json; charset=utf-8
Captcha data received: {sessionId: 'uuid-here', hasImage: true}
```

### **Error Case (HTML instead of JSON):**
```
Loading captcha...
Captcha response status: 200
Captcha response headers: text/html; charset=utf-8
Expected JSON but got: text/html <!DOCTYPE html>...
```

## 🛠️ **Quick Fixes**

### **Fix 1: Clear Browser Cache**
```
Ctrl + Shift + R (Hard refresh)
```

### **Fix 2: Test Direct API**
Open new tab and visit:
```
http://localhost:3000/api/captcha
```
Should show JSON response with sessionId and image data.

### **Fix 3: Test Registration Form**
1. Go to: `http://localhost:3000/auth`
2. Click Register tab
3. Scroll down to see captcha section
4. Check browser console for errors

### **Fix 4: Use Test Page**
Visit: `http://localhost:3000/test-captcha.html`
This page has detailed debugging information.

## 🎯 **Most Likely Solutions**

### **Solution 1: Browser Cache Issue**
- Clear browser cache and cookies
- Try incognito/private browsing mode

### **Solution 2: Vite Dev Server Issue**
- The error "Unexpected token '<'" usually means HTML is returned instead of JSON
- This happens when the API route isn't properly registered

### **Solution 3: Route Conflict**
- Make sure `/api/captcha` isn't being intercepted by frontend routing

## 📋 **Debug Commands**

### **Test Backend Only:**
```powershell
# Test captcha generation
Invoke-WebRequest -Uri "http://localhost:3000/api/test-captcha" -UseBasicParsing

# Test captcha endpoint
Invoke-WebRequest -Uri "http://localhost:3000/api/captcha" -UseBasicParsing
```

### **Check Server Logs:**
Look at your terminal where `npm run dev` is running for any error messages.

## 🎮 **Final Test**

1. **Open**: `http://localhost:3000/auth`
2. **Click**: Register tab
3. **Scroll down**: Look for captcha section
4. **Check console**: Should see captcha loading logs
5. **Verify**: Captcha image appears (4-digit code)

If you still see the error, please share:
1. **Console logs** from browser DevTools
2. **Network tab** showing the `/api/captcha` request
3. **Server terminal** output

The backend is working perfectly, so it's likely a frontend routing or caching issue! 🎯✨
