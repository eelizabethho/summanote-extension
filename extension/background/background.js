console.log("🚀 Background script loaded successfully!");

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("📨 Background script received message:", request);
    
    if (request.action === 'summarize') {
        console.log("Starting ChatGPT summarization for text:", request.text.substring(0, 100) + "...");
        
        // Use ChatGPT API for summarization
        summarizeWithChatGPT(request.text)
            .then(result => {
                console.log("Summary generated:", result);
                
                // Store the summary data for the popup to access
                chrome.storage.local.set({
                    'currentSummary': {
                        summary: result.summary,
                        bulletPoints: result.bulletPoints,
                        timestamp: Date.now()
                    }
                }, function() {
                    console.log("Summary data stored in chrome.storage.local");
                });
                
                sendResponse({ 
                    success: true, 
                    summary: result.summary,
                    bulletPoints: result.bulletPoints
                });
            })
            .catch(error => {
                console.error("ChatGPT summarization failed:", error);
                sendResponse({ 
                    success: false, 
                    error: error.message 
                });
            });
        
        return true; // Keep connection open for async response
    }
    
    // Handle TTS requests from popup
    if (request.action === "speakText" && request.text) {
        console.log("🔊 TTS request received:", request.text.substring(0, 50) + "...");
        getAndPlayAudio(request.text);
        return true;
    }
    
    // Handle summary updates
    if (request.action === "updateSummary") {
        console.log("📝 Received summary update:", request);
        // Store the summary data for the popup
        chrome.storage.local.set({
            currentSummary: {
                summary: request.summary,
                bulletPoints: request.bulletPoints || []
            }
        });
        console.log("💾 Summary data stored for popup");
        return true;
    }
});

// OpenAI API summarization function
async function summarizeWithChatGPT(text) {
    try {
        console.log("Using OpenAI API for summarization...");
        
        // Use a hardcoded API key for the extension (you can replace this with your own)
        const apiKey = "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"; // Replace with your actual OpenAI API key
        
        // TODO: Replace the line above with your actual API key like this:
        // const apiKey = "sk-proj-your-actual-api-key-here";
        
        // If you have an API key, comment out the line below to use AI instead of fallback
        // return createFallbackSummary(text);
        
        // Call OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert summarizer. Create a simple, easy-to-understand summary that captures the main points and key information from the provided text. Make it concise and clear. Keep it under 150 words.'
                    },
                    {
                        role: 'user',
                        content: text
                    }
                ],
                max_tokens: 150,
                temperature: 0.3
            })
        });
        
        console.log("OpenAI API Response status:", response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenAI API Error response:", errorText);
            console.error("API Key used:", apiKey.substring(0, 20) + "...");
            
            // If API fails, fall back to simple summarization
            console.log("API failed, using fallback summarization");
            return createFallbackSummary(text);
        }
        
        const data = await response.json();
        console.log("OpenAI API Response data:", data);
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error("Invalid OpenAI API response format");
        }
        
        const aiSummary = data.choices[0].message.content;
        
        // Create bullet points from the summary
        const sentences = aiSummary.split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 10)
            .slice(0, 3);
        
        return {
            summary: `AI Summary: ${aiSummary}`,
            bulletPoints: sentences
        };
        
    } catch (error) {
        console.error("OpenAI API failed:", error.message);
        // Fall back to simple summarization if API fails
        return createFallbackSummary(text);
    }
}

// Fallback summarization if OpenAI API fails
function createFallbackSummary(text) {
    // Split text into sentences
    const sentences = text.split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 10);
    
    if (sentences.length <= 1) {
        return `📝 Summary: ${text}`;
    }
    
    // Find the most important sentences
    const importantSentences = [];
    
    // Always include first sentence (usually introduction)
    importantSentences.push(sentences[0]);
    
    // Find sentences with important keywords
    const importantKeywords = ['important', 'key', 'main', 'primary', 'essential', 'significant', 'crucial', 'notable', 'remarkable', 'major', 'critical'];
    const keywordSentences = sentences.filter(s => 
        importantKeywords.some(keyword => s.toLowerCase().includes(keyword))
    );
    
    if (keywordSentences.length > 0) {
        importantSentences.push(keywordSentences[0]);
    }
    
    // Find sentences with numbers or statistics
    const statSentences = sentences.filter(s => /\d+/.test(s));
    if (statSentences.length > 0 && !importantSentences.includes(statSentences[0])) {
        importantSentences.push(statSentences[0]);
    }
    
    // Include last sentence if different (usually conclusion)
    if (sentences.length > 1 && !importantSentences.includes(sentences[sentences.length - 1])) {
        importantSentences.push(sentences[sentences.length - 1]);
    }
    
    // Create summary and bullet points
    const summary = importantSentences.slice(0, 3).join(' ');
    const bulletPoints = importantSentences.slice(0, 3).map(sentence => {
        const cleanSentence = sentence.trim().replace(/^[•\-\*]\s*/, '');
        return cleanSentence.length > 100 ? cleanSentence.substring(0, 100) + '...' : cleanSentence;
    });
    
    return {
        summary: `Summary: ${summary}`,
        bulletPoints: bulletPoints
    };
}

// TTS Functions for ElevenLabs API
async function getAndPlayAudio(text) {
    const apiKey = "0718aab5eaa5d81fa381e034c6d28876f1def05e69c6e72d3e051fbebf79ebb0";
    const voiceId = "21m00Tcm4TlvDq8ikWAM"; // Voice: "Rachel"

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
        body: JSON.stringify({
            text: text,
            model_id: "eleven_multilingual_v2",
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
    };

    try {
        console.log("🔊 Making ElevenLabs API request...");
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`ElevenLabs API request failed with status ${response.status}`);
        }
        
        const audioBlob = await response.blob();
        console.log("🎵 Audio blob received, size:", audioBlob.size);
        await playAudioOffscreen(audioBlob);

    } catch (error) {
        console.error("❌ Error with ElevenLabs API:", error);
        // Fallback to browser TTS
        fallbackTTS(text);
    }
}

// Fallback to browser TTS if ElevenLabs fails
function fallbackTTS(text) {
    console.log("🔄 Using browser fallback TTS");
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
    }
}

// This function creates and uses an offscreen document to play audio
async function playAudioOffscreen(audioBlob) {
    try {
        // Check if offscreen document already exists
        if (await chrome.offscreen.hasDocument()) {
            console.log("📄 Offscreen document exists, sending audio data");
            // Convert blob to array buffer for transfer
            const arrayBuffer = await audioBlob.arrayBuffer();
            chrome.runtime.sendMessage({ 
                target: 'offscreen', 
                data: { 
                    action: 'play', 
                    audioData: Array.from(new Uint8Array(arrayBuffer)),
                    mimeType: audioBlob.type
                } 
            });
        } else {
            console.log("📄 Creating offscreen document for audio playback");
            await chrome.offscreen.createDocument({
                url: 'offscreen.html',
                reasons: ['AUDIO_PLAYBACK'],
                justification: 'Playing text-to-speech audio from ElevenLabs',
            });
            
            // Wait for offscreen document to be ready
            setTimeout(async () => {
                const arrayBuffer = await audioBlob.arrayBuffer();
                chrome.runtime.sendMessage({ 
                    target: 'offscreen', 
                    data: { 
                        action: 'play', 
                        audioData: Array.from(new Uint8Array(arrayBuffer)),
                        mimeType: audioBlob.type
                    } 
                });
            }, 500);
        }
    } catch (error) {
        console.error("❌ Error with offscreen audio playback:", error);
        fallbackTTS("Audio playback failed, using fallback");
    }
}