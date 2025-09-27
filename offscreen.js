chrome.runtime.onMessage.addListener((message) => {
  if (message.target === 'offscreen' && message.data.action === 'play') {
    const audio = document.getElementById('tts-audio');
    audio.src = message.data.url;
    audio.play();
  }
});