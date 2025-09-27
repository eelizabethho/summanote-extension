console.log("Popup loaded successfully!");
// Button click for TTS
document.getElementById("ttsBtn").addEventListener("click", () => {
  speakContent();
});

// Spacebar triggers TTS
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault(); // Prevents page scrolling
    speakContent();
  }
});

// Simple TTS function (frontend only, uses browser API)
function speakContent() {
  const summary = document.getElementById("summaryText").innerText;
  const bullets = [...document.querySelectorAll("#bulletList li")]
    .map(li => li.innerText)
    .join(". ");

  const fullText = `${summary}. ${bullets}`;

  const utterance = new SpeechSynthesisUtterance(fullText);
  speechSynthesis.speak(utterance);
}