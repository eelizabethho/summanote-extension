// Debug content script to test if extension is loading
console.log("🔍 SummaNote Debug Content Script Loaded!");
console.log("📍 Current URL:", window.location.href);
console.log("📝 Extension should be working now...");

// Test if we can access Chrome APIs
if (typeof chrome !== 'undefined' && chrome.runtime) {
    console.log("✅ Chrome extension API available");
    console.log("🆔 Extension ID:", chrome.runtime.id);
} else {
    console.log("❌ Chrome extension API not available");
}

// Test speech synthesis
if (typeof speechSynthesis !== 'undefined') {
    console.log("✅ Speech synthesis available");
} else {
    console.log("❌ Speech synthesis not available");
}

// Add a visible indicator that the extension is loaded
const indicator = document.createElement('div');
indicator.id = 'summanote-debug-indicator';
indicator.innerHTML = '🔍 SummaNote Debug: Extension Loaded';
indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #4b0082;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 999999;
    font-family: Arial, sans-serif;
`;
document.body.appendChild(indicator);

// Remove indicator after 5 seconds
setTimeout(() => {
    const indicator = document.getElementById('summanote-debug-indicator');
    if (indicator) {
        indicator.remove();
    }
}, 5000);

// Test text selection
document.addEventListener('mouseup', function() {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text && text.length > 10) {
        console.log("📝 Text selected:", text.substring(0, 50) + "...");
        console.log("🎯 SummaNote should show tooltip now");
    }
});
