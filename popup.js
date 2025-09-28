chrome.storage.local.get(['currentSummary'], function(result) {
  if (result.currentSummary) {
    updateSummaryDisplay(result.currentSummary);
  } else {
    showDefaultMessage();
  }
});

setInterval(() => {
  chrome.storage.local.get(['currentSummary'], function(result) {
    if (result.currentSummary && result.currentSummary.summary && 
        !result.currentSummary.summary.includes("AI is summarizing")) {
      updateSummaryDisplay(result.currentSummary);
    }
  });
}, 2000);

function updateSummaryDisplay(summaryData) {
  const loadingIndicator = document.getElementById("loadingIndicator");
  if (loadingIndicator) {
    loadingIndicator.style.display = "none";
  }
  
  const summaryElement = document.getElementById("summaryText");
  if (summaryElement) {
    summaryElement.textContent = summaryData.summary;
    summaryElement.style.color = "#333";
    summaryElement.style.fontStyle = "normal";
    
    summaryElement.style.animation = "pulse 0.5s ease-in-out";
    setTimeout(() => {
      summaryElement.style.animation = "";
    }, 500);
  }
  
  const bulletListElement = document.getElementById("bulletList");
  if (bulletListElement) {
    bulletListElement.innerHTML = summaryData.bulletPoints
      .map(point => `<li>${point}</li>`)
      .join('');
  }
  
  const aiBadge = document.getElementById("aiBadge");
  if (aiBadge) {
    aiBadge.style.display = "inline-block";
  }
}

function showLoadingState() {
  const loadingIndicator = document.getElementById("loadingIndicator");
  if (loadingIndicator) {
    loadingIndicator.style.display = "block";
  }
  
  const aiBadge = document.getElementById("aiBadge");
  if (aiBadge) {
    aiBadge.style.display = "none";
  }
  
  const summaryElement = document.getElementById("summaryText");
  if (summaryElement) {
    summaryElement.textContent = "AI is analyzing your text...";
    summaryElement.style.color = "#666";
    summaryElement.style.fontStyle = "italic";
  }
}

function showStatusMessage(message, type = "info") {
  const statusMessage = document.getElementById("statusMessage");
  const statusText = document.getElementById("statusText");
  
  if (statusMessage && statusText) {
    statusText.textContent = message;
    statusMessage.style.display = "block";
    statusMessage.className = `status-message ${type}`;
    
    setTimeout(() => {
      statusMessage.style.display = "none";
    }, 3000);
  }
}

function showDefaultMessage() {
  const summaryElement = document.getElementById("summaryText");
  if (summaryElement) {
    summaryElement.textContent = "Your summary will appear here...";
    summaryElement.style.color = "#999";
    summaryElement.style.fontStyle = "italic";
  }
}

async function speakWithAmazonPolly() {
  const summary = document.getElementById("summaryText").innerText;
  const bullets = [...document.querySelectorAll("#bulletList li")]
    .map(li => li.innerText)
    .join(". ");

  const fullText = `${summary}. ${bullets}`;

  if (fullText && fullText !== "Your summary will appear here.... Key point 1. Key point 2. Key point 3") {
    await speakWithPollyAPI(fullText);
  }
}

async function speakWithPollyAPI(text) {
  try {
    const response = await fetch('http://localhost:5002/polly-tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: text })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Amazon Polly backend failed with status ${response.status}: ${errorText}`);
    }

    const audioBlob = await response.blob();
    
    const audio = new Audio();
    audio.src = URL.createObjectURL(audioBlob);
    audio.play();

  } catch (error) {
    alert("Sorry, the speaker is not available right now. Please try again later.");
  }
}

document.getElementById("pollyBtn").addEventListener("click", () => {
  speakWithAmazonPolly();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateSummary") {
    if (message.summary && message.summary.includes("AI is summarizing")) {
      showLoadingState();
    } else {
      updateSummaryDisplay(message);
    }
  }
  
  if (message.action === "speakInPopup") {
  }
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    speakWithAmazonPolly();
  }
});