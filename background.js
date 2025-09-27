import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

// ⚠️ 🔑 INJECT YOUR CREDENTIALS HERE FOR HACKATHON TESTING 🔑 ⚠️
// -----------------------------------------------------------
const ACCESS_KEY_ID = "AKIAR7IXWDEHKNNWYLMB";        // <-- PASTE YOUR KEY ID HERE
const SECRET_ACCESS_KEY = "Iu+5Zv+3ksKUESYLpwhhsarnvLZriPpuhyZRkAkZ"; // <-- PASTE YOUR SECRET KEY HERE
// -----------------------------------------------------------

(function() {
    
    // --- CONFIGURATION ---
    const AWS_REGION = "us-east-1"; 
    
    console.log("DEBUG: 1. Initializing Polly Client in region:", AWS_REGION);

    // Initialize the Polly client with EXPLICIT CREDENTIALS
    // The SDK will now use THESE instead of searching the filesystem.
    const pollyClient = new PollyClient({ 
      region: AWS_REGION, 
      credentials: {
          accessKeyId: ACCESS_KEY_ID,
          secretAccessKey: SECRET_ACCESS_KEY,
      },
    });

    // Handle messages from content script and popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log("Background script received message:", request);
        
        // Handle text summarization requests
        if (request.action === 'summarize') {
            console.log("Starting ChatGPT summarization for text:", request.text.substring(0, 100) + "...");
            
            // Use ChatGPT API for summarization
            summarizeWithChatGPT(request.text)
                .then(summary => {
                    console.log("ChatGPT summary generated:", summary);
                    sendResponse({ 
                        success: true, 
                        summary: summary 
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
        
        // Handle text-to-speech requests
        if (request.action === "speakText" && request.text) {
            getAndPlayAudio(request.text);
            return true;
        }
    });

    // OpenAI API summarization function
    async function summarizeWithChatGPT(text) {
        try {
            console.log("Using OpenAI API for summarization...");
            
            // Use a hardcoded API key for the extension (you can replace this with your own)
            const apiKey = "sk-proj-YOUR_API_KEY_HERE"; // Replace with your actual OpenAI API key
            
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
                            content: `You are a helpful summarizer. Write simple, easy-to-understand summaries.

Format your response exactly like this:
SUMMARY: [Write a simple paragraph in plain English]
KEY POINTS:
• [First main point]
• [Second main point] 
• [Third main point]

Keep it simple. Use everyday words. Make it easy to read.`
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
                
                // If API fails, fall back to simple summarization
                console.log("API failed, using fallback summarization");
                return createFallbackSummary(text);
            }
            
            const data = await response.json();
            console.log("OpenAI API Response data:", data);
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error("Invalid OpenAI API response format");
            }
            
            return `🤖 AI Summary: ${data.choices[0].message.content}`;
            
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
        
        // Create simple summary and bullet points
        const summary = importantSentences.slice(0, 3).join(' ');
        
        // Create simple bullet points (max 3)
        const bullets = importantSentences.slice(0, 3).map(sentence => {
            const cleanSentence = sentence.trim().replace(/^[•\-\*]\s*/, '');
            return `• ${cleanSentence}`;
        }).join('\n');
        
        return `SUMMARY: ${summary}\n\nKEY POINTS:\n${bullets}`;
    }

    // AWS Polly text-to-speech function
    async function getAndPlayAudio(text) {
        console.log("DEBUG: 2. getAndPlayAudio called with text:", text.substring(0, 30) + '...');
        
        const command = new SynthesizeSpeechCommand({
            Text: text,
            OutputFormat: "mp3", 
            VoiceId: "Joanna",
            Engine: "neural",
        });

        try {
            console.log("DEBUG: 3. Attempting to send SynthesizeSpeechCommand to AWS...");
            
            const response = await pollyClient.send(command);
            
            console.log("DEBUG: 4. AWS response received successfully.");
            
            const audioStream = response.AudioStream;

            if (!audioStream) {
                console.error("DEBUG: ERROR: Polly response did not contain an audio stream.");
                throw new Error("Polly response did not contain an audio stream.");
            }

            console.log("DEBUG: 5. Converting audio stream to Blob.");
            const audioBlob = await new Response(audioStream).blob();
            
            await playAudioOffscreen(audioBlob);
            console.log("DEBUG: 6. Playback message sent to offscreen document.");

        } catch (error) {
            console.error("DEBUG: FATAL ERROR with Amazon Polly API or SDK:", error);
        }
    }

    // Offscreen audio playback function
    async function playAudioOffscreen(audioBlob) {
        if (!chrome.offscreen) {
            console.error("DEBUG: Offscreen API is undefined. Check manifest permissions.");
            return;
        }

        try {
            if (await chrome.offscreen.hasDocument()) {
                console.log("DEBUG: Offscreen document exists, sending audio blob");
                chrome.runtime.sendMessage({
                    target: 'offscreen',
                    data: { action: 'play', blob: audioBlob }
                });
            } else {
                console.log("DEBUG: Creating offscreen document for audio playback");
                await chrome.offscreen.createDocument({
                    url: 'offscreen.html',
                    reasons: ['AUDIO_PLAYBACK'],
                    justification: 'Playing text-to-speech audio from Amazon Polly',
                });
                
                // Wait a bit for the offscreen document to initialize
                await new Promise(resolve => setTimeout(resolve, 100));
                
                console.log("DEBUG: Sending audio blob to newly created offscreen document");
                chrome.runtime.sendMessage({
                    target: 'offscreen',
                    data: { action: 'play', blob: audioBlob }
                });
            }
        } catch (error) {
            console.error("DEBUG: Error in playAudioOffscreen:", error);
        }
    }

})();