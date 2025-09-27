console.log("Popup loaded successfully!");

// Load stored summary data when popup opens
chrome.storage.local.get(['currentSummary'], function(result) {
  if (result.currentSummary) {
    console.log("📝 Loading stored summary data:", result.currentSummary);
    
    // Update the popup display with the stored summary
    updateSummaryDisplay(result.currentSummary);
    console.log("✅ Popup display updated with stored summary");
  } else {
    // Show default message if no summary
    showDefaultMessage();
  }
});

// Also check for summary data every 2 seconds as a fallback
setInterval(() => {
  chrome.storage.local.get(['currentSummary'], function(result) {
    if (result.currentSummary && result.currentSummary.summary && 
        !result.currentSummary.summary.includes("🤖 AI is summarizing")) {
      console.log("🔄 Fallback: Found stored summary, updating popup");
      updateSummaryDisplay(result.currentSummary);
    }
  });
}, 2000);

// Function to update the summary display
function updateSummaryDisplay(summaryData) {
  console.log("🎨 Updating popup display with:", summaryData);
  
  // Hide loading indicator
  const loadingIndicator = document.getElementById("loadingIndicator");
  if (loadingIndicator) {
    loadingIndicator.style.display = "none";
  }
  
  // Update summary text
  const summaryElement = document.getElementById("summaryText");
  if (summaryElement) {
    summaryElement.textContent = summaryData.summary;
    summaryElement.style.color = "#333";
    summaryElement.style.fontStyle = "normal";
    
    // Add pulse animation
    summaryElement.style.animation = "pulse 0.5s ease-in-out";
    setTimeout(() => {
      summaryElement.style.animation = "";
    }, 500);
  }
  
  // Update bullet points
  const bulletListElement = document.getElementById("bulletList");
  if (bulletListElement) {
    bulletListElement.innerHTML = summaryData.bulletPoints
      .map(point => `<li>${point}</li>`)
      .join('');
  }
  
  // Show AI badge
  const aiBadge = document.getElementById("aiBadge");
  if (aiBadge) {
    aiBadge.style.display = "inline-block";
  }
  
  // Show success status
  showStatusMessage("✅ AI Summary Generated Successfully!", "success");
  
  console.log("✅ Popup display updated with AI summary");
}

// Function to show loading state
function showLoadingState() {
  console.log("🔄 Showing loading state in popup");
  
  const loadingIndicator = document.getElementById("loadingIndicator");
  if (loadingIndicator) {
    loadingIndicator.style.display = "block";
  }
  
  // Hide AI badge
  const aiBadge = document.getElementById("aiBadge");
  if (aiBadge) {
    aiBadge.style.display = "none";
  }
  
  // Reset summary text
  const summaryElement = document.getElementById("summaryText");
  if (summaryElement) {
    summaryElement.textContent = "🤖 AI is analyzing your text...";
    summaryElement.style.color = "#666";
    summaryElement.style.fontStyle = "italic";
  }
}

// Function to show status messages
function showStatusMessage(message, type = "info") {
  const statusMessage = document.getElementById("statusMessage");
  const statusText = document.getElementById("statusText");
  
  if (statusMessage && statusText) {
    statusText.textContent = message;
    statusMessage.style.display = "block";
    statusMessage.className = `status-message ${type}`;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      statusMessage.style.display = "none";
    }, 3000);
  }
}

// Function to show default message
function showDefaultMessage() {
  const summaryElement = document.getElementById("summaryText");
  if (summaryElement) {
    summaryElement.textContent = "Your summary will appear here...";
    summaryElement.style.color = "#999";
    summaryElement.style.fontStyle = "italic";
  }
}

// This function now gathers the text and sends it to the background script
function speakWithElevenLabs() {
  const summary = document.getElementById("summaryText").innerText;
  const bullets = [...document.querySelectorAll("#bulletList li")]
    .map(li => li.innerText)
    .join(". ");

  // Combine the summary and bullet points into one text block
  const fullText = `${summary}. ${bullets}`;

  if (fullText && fullText !== "Your summary will appear here.... Key point 1. Key point 2. Key point 3") {
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

// Listen for real-time summary updates
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateSummary") {
    console.log("📝 Received real-time summary update:", message);
    
    // Check if this is a loading state or actual summary
    if (message.summary && message.summary.includes("🤖 AI is summarizing")) {
      showLoadingState();
    } else {
      // Update the popup display with actual AI summary
      updateSummaryDisplay(message);
    }
    
    console.log("✅ Popup updated with AI summary");
  }
});

// Spacebar triggers TTS
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault(); // Prevents page scrolling
    speakWithElevenLabs();
  }
});