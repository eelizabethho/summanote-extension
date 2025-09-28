chrome.runtime.onMessage.addListener((message) => {
  if (message.target === 'offscreen' && message.data.action === 'play') {
    console.log("🎵 Offscreen received audio data");
    
    try {
      // Convert array data back to blob
      const audioData = new Uint8Array(message.data.audioData);
      const audioBlob = new Blob([audioData], { type: message.data.mimeType || 'audio/mpeg' });
      
      // Create object URL and play
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = document.getElementById('tts-audio');
      
      // Clean up previous audio URL
      if (audio.src) {
        URL.revokeObjectURL(audio.src);
      }
      
      audio.src = audioUrl;
      audio.play().then(() => {
        console.log("🔊 Audio playback started successfully");
      }).catch(error => {
        console.error("❌ Audio playback failed:", error);
      });
      
    } catch (error) {
      console.error("❌ Error processing audio data:", error);
    }
  }
});