# 🔍 SummaNote Extension Debug Guide

## **The UI isn't showing up? Let's fix it!**

### **Step 1: Check Extension Loading**

1. **Open Chrome** and go to `chrome://extensions/`
2. **Enable Developer mode** (toggle in top right)
3. **Click "Load unpacked"** and select your project folder
4. **Check for errors** - look for red error messages
5. **Make sure the extension is enabled** (toggle should be ON)

### **Step 2: Test with Debug Version**

1. **Rename your current manifest**:
   ```bash
   mv manifest.json manifest-original.json
   mv manifest-debug.json manifest.json
   ```

2. **Reload the extension** in Chrome (click the refresh button)

3. **Open any webpage** - you should see a purple "SummaNote Debug: Extension Loaded" indicator in the top-right corner

4. **If you see the debug indicator**, the extension is loading correctly!

### **Step 3: Test Content Script**

1. **Open the test page**: `test_extension.html`
2. **Open Chrome DevTools** (F12)
3. **Go to Console tab**
4. **Look for these messages**:
   - `🔍 SummaNote Debug Content Script Loaded!`
   - `✅ Chrome extension API available`
   - `✅ Speech synthesis available`

### **Step 4: Test Text Selection**

1. **Select some text** on the test page
2. **Check the console** for: `📝 Text selected: ...`
3. **Look for the SummaNote tooltip** (purple box with "S" logo)

### **Step 5: Common Issues & Solutions**

#### **❌ Extension not loading:**
- **Check file paths** in manifest.json
- **Make sure all files exist** (background.js, content.js, popup.html)
- **Check for JavaScript errors** in the extension details

#### **❌ Content script not running:**
- **Refresh the page** after loading the extension
- **Check if the script is injected** (look for console messages)
- **Make sure the URL matches** the content script matches

#### **❌ No tooltip appearing:**
- **Check if text is selected** (at least 10 characters)
- **Look for JavaScript errors** in console
- **Make sure the content script is running**

#### **❌ Background script errors:**
- **Check the extension's background page** for errors
- **Make sure the service worker is running**
- **Check for API connection issues**

### **Step 6: Switch Back to Full Version**

Once debugging is complete:

1. **Rename back to original**:
   ```bash
   mv manifest.json manifest-debug.json
   mv manifest-original.json manifest.json
   ```

2. **Reload the extension** in Chrome

### **Step 7: Final Test**

1. **Load the extension** with the original manifest
2. **Open test_extension.html**
3. **Select the highlighted text**
4. **Click the SummaNote tooltip**
5. **Click "🔊 Speak"** - you should hear the text!

## **🔧 Quick Fixes:**

### **If extension won't load:**
```bash
# Check if all files exist
ls -la extension/background/background.js
ls -la extension/content/content.js
ls -la extension/popup/popup.html
```

### **If content script won't run:**
- Make sure the manifest.json has the right file paths
- Check for JavaScript syntax errors
- Refresh the page after loading the extension

### **If tooltip won't appear:**
- Make sure you're selecting at least 10 characters
- Check the browser console for errors
- Try on a different webpage

## **📞 Still Not Working?**

If you're still having issues:

1. **Check the browser console** for any error messages
2. **Check the extension's background page** for errors
3. **Make sure the Polly API server is running** (`curl http://localhost:5001/api/polly/health`)
4. **Try the debug version first** to isolate the issue

**The debug version will show you exactly what's working and what's not! 🎯**
