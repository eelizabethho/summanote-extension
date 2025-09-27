// Popup script for SummaNote Extension
console.log("SummaNote popup loaded!");

// Get the current tab
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    console.log("Current tab:", currentTab.url);
    
    // Check if we can access the tab
    if (currentTab.url.startsWith('chrome://') || currentTab.url.startsWith('chrome-extension://')) {
        document.getElementById('summaryText').textContent = "Please navigate to a regular webpage to use SummaNote.";
        return;
    }
});

// Handle the TTS button click
document.getElementById('ttsBtn').addEventListener('click', function() {
    console.log("TTS button clicked");
    
    // Test with sample text first
    const testText = "Hello! This is a test of the SummaNote text-to-speech feature. The extension is working correctly.";
    console.log("Testing TTS with sample text:", testText);
    
    // Use browser TTS to speak the test text
    const utterance = new SpeechSynthesisUtterance(testText);
    utterance.onstart = () => {
        console.log("✅ Speech started");
        document.getElementById('summaryText').textContent = "🔊 Speaking test text...";
    };
    utterance.onend = () => {
        console.log("✅ Speech ended");
        document.getElementById('summaryText').textContent = "✅ TTS test completed! The extension is working.";
    };
    utterance.onerror = (e) => {
        console.log("❌ Speech error:", e);
        document.getElementById('summaryText').textContent = "❌ TTS error: " + e.error;
    };
    
    speechSynthesis.speak(utterance);
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Popup received message:", request);
    
    if (request.action === 'updateSummary') {
        document.getElementById('summaryText').textContent = request.summary;
    }
});
