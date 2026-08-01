# SummaNote

An AI-powered Chrome extension: highlight text on any webpage, get an
instant AI summary, and listen to it read aloud.

Built at VTHacks 13 (Virginia Tech, Sep 26–28, 2025). Team of 4 — I was
the largest contributor.
[Devpost submission](https://devpost.com/software/summanotes).

## What it does

- Highlight text on any webpage → click "Summarize"
- Get an AI-generated summary via OpenAI
- Listen to the summary with text-to-speech (ElevenLabs)
- Works on any site

## Tech stack

- **Extension:** JavaScript, Chrome Extension Manifest V3 (content
  scripts, background service worker, offscreen document for audio
  playback)
- **AI:** OpenAI API (summaries), ElevenLabs (text-to-speech)

## How to install (unpacked, for development)

Prereqs: an OpenAI API key and an ElevenLabs API key.

1. Clone the repo
   ```bash
   git clone https://github.com/eelizabethho/summanote-extension.git
   ```
2. Create a `.env` (or set keys in the background script) with your API
   keys — see the code for the exact variable names.
3. Open `chrome://extensions` in Chrome.
4. Turn on **Developer mode** (top right).
5. Click **Load unpacked** and select the cloned folder.
6. Pin the SummaNote icon to your toolbar.

## How to use

1. Select text on any webpage.
2. Click the **Summarize** button that appears.
3. Click the SummaNote icon in your toolbar to see the summary.
4. Click **Speaker** to hear it read aloud.

## How it works

1. Content script watches for text selection and shows the Summarize button.
2. On click, the background service worker sends the text to OpenAI.
3. The AI returns a summary.
4. The offscreen document handles audio playback for the TTS response
   (required because service workers can't play audio directly).

## Repo layout

- `manifest.json` — extension config (Manifest V3)
- `popup.html` / `popup.js` / `popup.css` — popup UI
- `background.js` — service worker (talks to OpenAI/ElevenLabs)
- `offscreen.html` / `offscreen.js` — audio playback (Chrome offscreen
  document pattern)
- `extension/content/content.js` — content script (select-to-summarize)
- `images/` — logo and icons
- `src/` — additional source files
- `requirements.txt` — Python dependencies (auxiliary tooling)
