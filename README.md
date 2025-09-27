# 🎯 SummaNote Extension

AI-powered text summarization Chrome extension with Amazon Polly text-to-speech integration.

## 🚀 Quick Start

### **1. Load the Extension**
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked" and select this folder
4. The extension will appear in your browser toolbar

### **2. Test the Extension**
1. Click the extension icon in your toolbar
2. Click "🔊 Test TTS" to test text-to-speech
3. Or open `simple_test.html` to test on a webpage

### **3. Use the Extension**
1. Select any text on a webpage
2. Click the purple "SummaNote" tooltip that appears
3. Click "🔊 Speak" in the summary popup

## 📁 Project Structure

```
summanote-extension/
├── extension/                 # Chrome extension files
│   ├── background/           # Background script
│   ├── content/             # Content script
│   ├── popup/               # Extension popup
│   └── assets/              # CSS and images
├── backend/                 # Python backend
│   ├── api/                 # Flask API endpoints
│   └── services/            # AWS Polly service
├── images/                  # Extension images
├── manifest.json            # Extension manifest
├── requirements.txt         # Python dependencies
└── test files              # Testing files
```

## 🔧 Setup

### **Python Dependencies**
```bash
pip install -r requirements.txt
```

### **Start Polly API Server**
```bash
# Demo mode (no AWS credentials needed)
python3 backend/api/demo_polly_api.py

# Real Polly (requires AWS credentials)
python3 backend/api/polly_api.py
```

## 🎯 Features

- **Text Summarization**: AI-powered text summarization
- **Text-to-Speech**: Amazon Polly integration with browser TTS fallback
- **Easy to Use**: Select text and click the tooltip
- **Cross-Platform**: Works on any website

## 🔧 Development

- **Extension**: Chrome Manifest V3
- **Backend**: Python Flask API
- **TTS**: Amazon Polly + Browser TTS fallback
- **AI**: OpenAI GPT integration

## 📝 Testing

- `simple_test.html` - Simple TTS test page
- `test_extension.html` - Full extension test page
- Extension popup - Direct TTS test button