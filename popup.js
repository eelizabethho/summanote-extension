console.log("Popup loaded successfully!");

// This function now gathers the text and sends it to the background script
function speakWithElevenLabs() {
  const summary = document.getElementById("summaryText").innerText;
  const bullets = [...document.querySelectorAll("#bulletList li")]
    .map(li => li.innerText)
    .join(". ");

  // Combine the summary and bullet points into one text block
  const fullText = `${summary}. ${bullets}`;

  if (fullText) {
    // THIS IS THE KEY CHANGE:
    // Instead of using the browser's speech, we send a message
    // to our background.js script, which will handle the API call.
    chrome.runtime.sendMessage({ action: "speakText", text: fullText });
    console.log("Sent text to background for TTS:", fullText);
  } else {
    console.log("No text to speak.");
  }
}

// Button click for TTS
document.getElementById("ttsBtn").addEventListener("click", () => {
  speakWithElevenLabs();
});

// Spacebar triggers TTS
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault(); // Prevents page scrolling
    speakWithElevenLabs();
  }
});