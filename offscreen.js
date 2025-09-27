chrome.runtime.onMessage.addListener((message) => {
  if (message.target === 'offscreen' && message.data.action === 'play') {
    const audioUrl = URL.createObjectURL(message.data.blob);
    const audio = document.getElementById('tts-audio');
    audio.src = audioUrl;
    audio.play();
  }
});