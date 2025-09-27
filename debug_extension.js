// Debug script for SummaNote Extension
// Run this in the browser console to check if the extension is working

console.log("🔍 SummaNote Extension Debug Script");
console.log("=====================================");

// Check if extension is loaded
if (typeof chrome !== 'undefined' && chrome.runtime) {
    console.log("✅ Chrome extension API detected");
    
    // Check if our extension is loaded
    if (chrome.runtime.id) {
        console.log("✅ Extension ID:", chrome.runtime.id);
    } else {
        console.log("❌ No extension ID found");
    }
} else {
    console.log("❌ Chrome extension API not detected");
}

// Check if content script is loaded
if (typeof getSelectedText === 'function') {
    console.log("✅ Content script functions detected");
} else {
    console.log("❌ Content script functions not found");
}

// Check if speech synthesis is available
if (typeof speechSynthesis !== 'undefined') {
    console.log("✅ Speech synthesis API available");
    
    // Get available voices
    const voices = speechSynthesis.getVoices();
    console.log("🎤 Available voices:", voices.length);
    if (voices.length > 0) {
        console.log("   - First voice:", voices[0].name);
    }
} else {
    console.log("❌ Speech synthesis API not available");
}

// Test speech synthesis
function testSpeech() {
    console.log("🔊 Testing speech synthesis...");
    const utterance = new SpeechSynthesisUtterance("Hello, this is a test of speech synthesis.");
    utterance.onstart = () => console.log("✅ Speech started");
    utterance.onend = () => console.log("✅ Speech ended");
    utterance.onerror = (e) => console.log("❌ Speech error:", e);
    speechSynthesis.speak(utterance);
}

// Check if Polly API is accessible
async function testPollyAPI() {
    console.log("🌐 Testing Polly API connection...");
    try {
        const response = await fetch('http://localhost:5001/api/polly/health');
        const data = await response.json();
        console.log("✅ Polly API response:", data);
    } catch (error) {
        console.log("❌ Polly API error:", error.message);
    }
}

// Run all tests
console.log("\n🧪 Running tests...");
testSpeech();
testPollyAPI();

console.log("\n📝 Instructions:");
console.log("1. Select some text on this page");
console.log("2. Look for the SummaNote tooltip");
console.log("3. Click it to test the extension");
console.log("4. Check the console for any errors");

// Export test functions
window.testSpeech = testSpeech;
window.testPollyAPI = testPollyAPI;
