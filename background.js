async function getAndPlayAudio(text) {
  const apiKey = "0718aab5eaa5d81fa381e034c6d28876f1def05e69c6e72d3e051fbebf79ebb0";
  const voiceId = "21m00Tcm4TlvDq8ikWAM";

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
  }
}

async function playAudioOffscreen(audioBlob) {
  if (await chrome.offscreen.hasDocument()) {
    chrome.runtime.sendMessage({ target: 'offscreen', data: { action: 'play', blob: audioBlob } });
  } else {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Playing text-to-speech audio from ElevenLabs',
    });
    setTimeout(() => {
        chrome.runtime.sendMessage({ target: 'offscreen', data: { action: 'play', blob: audioBlob } });
    }, 500);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "speakText" && message.text) {
    getAndPlayAudio(message.text);
    return true; 
  }
  
  if (message.action === "updateSummary") {
    chrome.storage.local.set({
      currentSummary: {
        summary: message.summary,
        bulletPoints: message.bulletPoints || []
      }
    });
    return true;
  }
});