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

// Summarize with AI button logic
document.getElementById("summarizeBtn").addEventListener("click", async () => {
  const aiSummaryDiv = document.getElementById("aiSummary");
  aiSummaryDiv.textContent = "Summarizing...";

  // Get the page text from the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => document.body.innerText,
    },
    async (results) => {
      const pageText = results[0].result;
      chrome.runtime.sendMessage({ action: "summarize", text: pageText }, (response) => {
        if (response && response.success) {
          // Parse summary and bullet points from response.summary
          const parsed = parseSummaryAndBullets(response.summary);
          aiSummaryDiv.innerHTML =
            `<div><strong>Summary:</strong> ${parsed.summary}</div>` +
            `<ul style='margin-top:0.5em;'>${parsed.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`;
        } else {
          aiSummaryDiv.textContent = response && response.error ? response.error : "Failed to summarize.";
        }
      });
    }
  );
});

// Helper to parse summary and bullet points from OpenAI response
function parseSummaryAndBullets(text) {
  let summary = "";
  let bullets = [];
  const summaryMatch = text.match(/SUMMARY:\s*([\s\S]*?)(KEY POINTS:|$)/i);
  if (summaryMatch) {
    summary = summaryMatch[1].trim();
  }
  const bulletMatch = text.match(/KEY POINTS:\s*([\s\S]*)/i);
  if (bulletMatch) {
    bullets = bulletMatch[1].split(/[\n•\-\*]+/).map(s => s.trim()).filter(Boolean);
  }
  return { summary, bullets };
}