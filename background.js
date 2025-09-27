// This function handles the actual API call to ElevenLabs
async function getAndPlayAudio(text) {
  const apiKey = "0718aab5eaa5d81fa381e034c6d28876f1def05e69c6e72d3e051fbebf79ebb0";
  const voiceId = "21m00Tcm4TlvDq8ikWAM"; // Voice: "Rachel"

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
    body: JSON.stringify({
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
    
    const audioBlob = await response.blob();
    await playAudioOffscreen(audioBlob);

  } catch (error) {
    console.error("Error with ElevenLabs API:", error);
  }
}

// This function creates and uses an offscreen document to play audio.
async function playAudioOffscreen(audioBlob) {
  if (await chrome.offscreen.hasDocument()) {
    chrome.runtime.sendMessage({ target: 'offscreen', data: { action: 'play', blob: audioBlob } });
  } else {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Playing text-to-speech audio from ElevenLabs',
    });
    // A short delay to allow the offscreen document to be created
    setTimeout(() => {
        chrome.runtime.sendMessage({ target: 'offscreen', data: { action: 'play', blob: audioBlob } });
    }, 500);
  }
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "speakText" && message.text) {
    getAndPlayAudio(message.text);
    return true; 
  }
  
  if (message.action === "updateSummary") {
    console.log("📝 Received summary update:", message);
    // Store the summary data for the popup
    chrome.storage.local.set({
      currentSummary: {
        summary: message.summary,
        bulletPoints: message.bulletPoints || []
      }
    });
    console.log("💾 Summary data stored for popup");
    return true;
  }
});