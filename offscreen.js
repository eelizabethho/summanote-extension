// offscreen.js - Handles audio playback in the offscreen document

console.log("DEBUG: Offscreen document script loaded.");

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("DEBUG: Offscreen received message:", message);
    
    // Check if this message is intended for the offscreen document
    if (message.target === 'offscreen' && message.data) {
        const { action, blob } = message.data;
        
        if (action === 'play' && blob) {
            console.log("DEBUG: Playing audio blob in offscreen document");
            playAudioBlob(blob);
            sendResponse({ success: true });
        } else {
            console.warn("DEBUG: Unknown action or missing blob:", action, !!blob);
            sendResponse({ success: false, error: "Unknown action or missing blob" });
        }
    }
    
    // Return true to indicate we will send a response asynchronously
    return true;
});

// Function to play audio blob
async function playAudioBlob(blob) {
    try {
        console.log("DEBUG: Creating audio element for blob playback");
        
        // Create audio element if it doesn't exist
        let audioElement = document.getElementById('tts-audio');
        if (!audioElement) {
            audioElement = document.createElement('audio');
            audioElement.id = 'tts-audio';
            audioElement.controls = false; // Hide controls in offscreen document
            document.body.appendChild(audioElement);
        }
        
        // Create object URL from blob
        const audioUrl = URL.createObjectURL(blob);
        console.log("DEBUG: Created audio URL:", audioUrl);
        
        // Set up event listeners
        audioElement.onloadeddata = () => {
            console.log("DEBUG: Audio data loaded successfully");
        };
        
        audioElement.onended = () => {
            console.log("DEBUG: Audio playback completed");
            // Clean up the object URL
            URL.revokeObjectURL(audioUrl);
        };
        
        audioElement.onerror = (error) => {
            console.error("DEBUG: Audio playback error:", error);
            URL.revokeObjectURL(audioUrl);
        };
        
        // Set source and play
        audioElement.src = audioUrl;
        
        try {
            await audioElement.play();
            console.log("DEBUG: Audio playback started successfully");
        } catch (playError) {
            console.error("DEBUG: Failed to start audio playback:", playError);
            URL.revokeObjectURL(audioUrl);
        }
        
    } catch (error) {
        console.error("DEBUG: Error in playAudioBlob:", error);
    }
}

// Log when the offscreen document is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: Offscreen document DOM loaded and ready for audio playback");
});

console.log("DEBUG: Offscreen message listener registered successfully");