chrome.runtime.onMessage.addListener((message) => {
  if (message.target === 'offscreen' && message.data.action === 'play') {
    try {
      const audioData = new Uint8Array(message.data.audioData);
      const audioBlob = new Blob([audioData], { type: message.data.mimeType || 'audio/mpeg' });
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = document.getElementById('tts-audio');
      
      if (audio.src) {
        URL.revokeObjectURL(audio.src);
      }
      
      audio.src = audioUrl;
      audio.play().then(() => {
      }).catch(error => {
      });
      
    } catch (error) {
    }
  }
});