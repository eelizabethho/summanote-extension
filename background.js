// This function handles the actual API call to ElevenLabs
async function getAndPlayAudio(text) {
  // IMPORTANT: Replace this with your actual ElevenLabs API key
  const apiKey = "sk_f67b48a9ff71898056b781926a70f8b332ebb2c739d5500c";
  
  // This is the ID of the voice you want to use. You can find voice IDs in the VoiceLab on the ElevenLabs website.
  // 'Rachel' is a popular, high-quality pre-made voice.
  const voiceId = "21m00Tcm4TlvDq8ikWAM"; 

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // We get the audio data as a Blob
    const audioBlob = await response.blob();
    // We create a URL that can be used to play the audio
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Use the Offscreen API to play the audio
    await playAudioOffscreen(audioUrl);

  } catch (error) {
    console.error("Error with ElevenLabs API:", error);
  }
}

// This function creates and uses an offscreen document to play audio.
// This is the modern, correct way to play audio in a Manifest V3 service worker.
async function playAudioOffscreen(audioUrl) {
  if (await chrome.offscreen.hasDocument()) {
    // Document exists, just send it the new URL
    chrome.runtime.sendMessage({ target: 'offscreen', data: { action: 'play', url: audioUrl } });
  } else {
    // Create the offscreen document
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Playing text-to-speech audio from ElevenLabs',
    });
    // The new document will have a listener that we can send the URL to once it's ready,
    // but for simplicity, we'll just assume it's ready quickly. A more robust solution
    // would wait for a confirmation message from the offscreen document.
    setTimeout(() => {
        chrome.runtime.sendMessage({ target: 'offscreen', data: { action: 'play', url: audioUrl } });
    }, 500); // Small delay to give the document time to set up
  }
}


// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Check if the message is for speaking text
  if (message.action === "speakText" && message.text) {
    getAndPlayAudio(message.text);
    return true; // Indicates you will send a response asynchronously
  }
});