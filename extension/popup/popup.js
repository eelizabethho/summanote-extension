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
    const testText = "Hello! This is a test of the SummaNote text-to-speech feature using Amazon Polly Joanna voice.";
    console.log("Testing TTS with sample text:", testText);
    
    // Use Amazon Polly instead of browser TTS
    speakWithPolly(testText);
});

// Function to speak with Amazon Polly
function speakWithPolly(text) {
    console.log("Starting Polly synthesis for text:", text.substring(0, 100) + "...");
    
    // Show loading state
    const summaryElement = document.getElementById('summaryText');
    summaryElement.textContent = '🔄 Synthesizing with Amazon Polly...';
    
    // Send text to background script for Polly synthesis
    chrome.runtime.sendMessage({
        action: 'synthesize_speech',
        text: text,
        voice_id: 'Joanna'
    }, (response) => {
        console.log("Received response from background script:", response);
        
        if (response && response.success) {
            console.log("SUCCESS: Playing real Amazon Polly audio");
            console.log("Audio data length:", response.audio_data ? response.audio_data.length : "undefined");
            console.log("Content type:", response.content_type);
            console.log("Voice ID:", response.voice_id);
            
            summaryElement.textContent = '🔊 Playing Amazon Polly Joanna voice...';
            // Play the audio from Polly
            playPollyAudio(response.audio_data, response.content_type);
        } else {
            console.error("Polly synthesis failed:", response.error);
            summaryElement.textContent = '❌ Polly failed, using browser TTS';
            // Fall back to browser TTS
            const utterance = new SpeechSynthesisUtterance(text);
            speechSynthesis.speak(utterance);
        }
    });
}

// Function to play Polly audio
function playPollyAudio(audioData, contentType) {
    try {
        console.log("Playing Polly audio, data length:", audioData.length);
        
        // Convert base64 audio data to blob
        const binaryString = atob(audioData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        const blob = new Blob([bytes], { type: contentType });
        const audioUrl = URL.createObjectURL(blob);
        
        console.log("Created audio URL:", audioUrl);
        
        // Create and play audio
        const audio = new Audio(audioUrl);
        
        audio.addEventListener('loadstart', () => {
            console.log("Audio loading started");
        });
        
        audio.addEventListener('canplay', () => {
            console.log("Audio can play");
        });
        
        audio.addEventListener('play', () => {
            console.log("Audio started playing - JOANNA IS SPEAKING!");
            document.getElementById('summaryText').textContent = '🎤 Amazon Polly Joanna is speaking!';
        });
        
        audio.addEventListener('ended', () => {
            console.log("Audio finished playing");
            document.getElementById('summaryText').textContent = '✅ Amazon Polly Joanna finished speaking!';
            URL.revokeObjectURL(audioUrl);
        });
        
        audio.addEventListener('error', (e) => {
            console.error("Audio error:", e);
            document.getElementById('summaryText').textContent = '❌ Audio playback error';
            URL.revokeObjectURL(audioUrl);
        });
        
        audio.play().then(() => {
            console.log("Polly audio playing successfully");
        }).catch(error => {
            console.error("Error playing Polly audio:", error);
            document.getElementById('summaryText').textContent = '❌ Failed to play audio';
            URL.revokeObjectURL(audioUrl);
        });
        
    } catch (error) {
        console.error("Error processing Polly audio:", error);
        document.getElementById('summaryText').textContent = '❌ Audio processing error';
    }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Popup received message:", request);
    
    if (request.action === 'updateSummary') {
        document.getElementById('summaryText').textContent = request.summary;
    }
});
