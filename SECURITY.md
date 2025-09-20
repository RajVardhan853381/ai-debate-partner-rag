# 🔐 SECURITY NOTICE - READ BEFORE PUSHING TO GITHUB!

## ⚠️ IMPORTANT: Protect Your API Key

Your project currently contains a **Google Gemini API key** in the file:
`backend/src/index.js`

**BEFORE pushing to GitHub, you MUST:**

1. **Replace your real API key** with a placeholder:
   ```javascript
   // In backend/src/index.js
   const GEMINI_API_KEY = 'your-gemini-api-key-here';
   ```

2. **Create instructions** for others to add their own API key

3. **Never commit real API keys** to version control

## 🔧 How to Secure Your API Key

### Option 1: Use Environment Variables (Recommended)
```javascript
// In backend/src/index.js
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'your-gemini-api-key-here';
```

### Option 2: Create a Config File
Create `backend/config.js` (add to .gitignore):
```javascript
module.exports = {
  GEMINI_API_KEY: 'your-actual-api-key-here'
};
```

## 📋 Pre-Push Checklist

- [ ] API key replaced with placeholder
- [ ] .gitignore includes sensitive files
- [ ] README includes setup instructions
- [ ] No personal information in code
- [ ] Test that app still works locally

## 🆘 If You Already Pushed Your API Key

1. **Immediately regenerate** your Gemini API key at [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Update your local code** with the new key
3. **Push a commit** removing the old key
4. **Consider your old key compromised**

---
**Remember**: API keys are like passwords - keep them secret! 🔐