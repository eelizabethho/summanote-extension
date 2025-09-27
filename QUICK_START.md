# 🚀 SummaNote Extension - Quick Start Guide

Your Amazon Polly integration is now set up and working! Here's how to use it:

## ✅ **What's Working:**

1. **✅ Extension files** - All properly configured
2. **✅ Background script** - Handles Polly synthesis
3. **✅ Content script** - Plays Polly audio
4. **✅ Demo Polly API** - Running on localhost:5001
5. **✅ Dependencies** - All installed (boto3, flask, etc.)

## 🎯 **How to Test Your Extension:**

### **Step 1: Load the Extension in Chrome**
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked" and select your project folder
4. The extension should appear in your extensions list

### **Step 2: Test the Extension**
1. Go to any webpage (like Wikipedia)
2. **Select some text** (at least 10 characters)
3. **Click the "SummaNote" tooltip** that appears
4. **Click "🔊 Speak"** in the summary popup
5. You should hear the text being read (using browser TTS as fallback)

### **Step 3: Test with Demo Polly API**
The extension will try to use Amazon Polly first, then fall back to browser TTS if it fails.

## 🔧 **Current Setup:**

- **Demo Mode**: No AWS credentials needed
- **Fallback**: Browser TTS if Polly fails
- **API Server**: Running on localhost:5001

## 🚀 **To Use Real Amazon Polly:**

### **Option 1: AWS Access Keys**
```bash
aws configure
# Enter your AWS Access Key ID and Secret Access Key
```

### **Option 2: Environment Variables**
```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=us-east-1
```

### **Option 3: Switch to Real Polly API**
```bash
# Stop demo server
pkill -f demo_polly_api.py

# Start real Polly API
python3 backend/api/polly_api.py
```

## 🐛 **Troubleshooting:**

### **Extension Not Working?**
1. Check Chrome console for errors (F12 → Console)
2. Make sure the extension is loaded and enabled
3. Check that the background script is running

### **Polly API Not Working?**
1. Check if server is running: `curl http://localhost:5001/api/polly/health`
2. Check server logs for errors
3. Verify AWS credentials if using real Polly

### **Audio Not Playing?**
1. Check browser console for audio errors
2. Make sure your browser allows audio
3. Try the fallback browser TTS

## 📁 **File Structure:**
```
summanote-extension/
├── extension/
│   ├── background/background.js     # Handles Polly synthesis
│   ├── content/content.js            # Plays audio
│   └── popup/popup.html             # Extension popup
├── backend/
│   ├── api/
│   │   ├── polly_api.py             # Real Polly API
│   │   └── demo_polly_api.py         # Demo API (no AWS needed)
│   └── services/
│       └── polly_service.py          # Polly service
├── manifest.json                     # Extension config
└── requirements.txt                  # Python dependencies
```

## 🎉 **You're All Set!**

Your SummaNote extension with Amazon Polly integration is ready to use! The extension will:
1. **Summarize text** using AI
2. **Read summaries aloud** using Amazon Polly (or browser TTS as fallback)
3. **Work on any webpage** where you select text

**Happy summarizing! 🎯**
