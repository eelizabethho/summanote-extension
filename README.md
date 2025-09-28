# SummaNote Extension
A Chrome extension that summarizes text and reads it out loud using AI.

## What it does

- Select text on any website
- Get an AI summary of that text
- Listen to the summary being read aloud
- Works on any webpage

## How to use

1. **Select text** on any webpage
2. **Click the "Summarize" button** that pops up
3. **Click the SummaNote icon** in your toolbar to see the summary
4. **Click "Speaker"** to hear the summary read aloud

## Files in this project

- `manifest.json` - Extension settings
- `popup.html` - The popup window you see
- `popup.js` - Makes the popup work
- `extension/background/background.js` - Talks to the AI
- `extension/content/content.js` - Adds the summarize button
- `images/` - Logo and pictures

## How it works

1. You select text on a webpage
2. The extension sends it to OpenAI's AI
3. The AI creates a summary
4. You can read the summary or listen to it
