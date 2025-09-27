// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Background script received message:", request);
    
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
    
    if (request.action === 'synthesize_speech') {
        console.log("Starting Amazon Polly synthesis for text:", request.text.substring(0, 100) + "...");
        
        // Use Amazon Polly for text-to-speech
        synthesizeWithPolly(request.text, request.voice_id)
            .then(audioData => {
                console.log("Polly synthesis completed");
                sendResponse({ 
                    success: true, 
                    audio_data: audioData.audio_data,
                    content_type: audioData.content_type,
                    voice_id: audioData.voice_id
                });
            })
            .catch(error => {
                console.error("Polly synthesis failed:", error);
                sendResponse({ 
                    success: false, 
                    error: error.message 
                });
            });
        
        return true; // Keep connection open for async response
    }
});

// OpenAI API summarization function
async function summarizeWithChatGPT(text) {
    try {
        console.log("Using OpenAI API for summarization...");
        
        // Use a hardcoded API key for the extension (you can replace this with your own)
        const apiKey = "sk-proj-YOUR_API_KEY_HERE"; // Replace with your actual OpenAI API key
        
        // For testing, let's use fallback immediately
        console.log("Using fallback summarization for testing");
        return createFallbackSummary(text);
        
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

// Amazon Polly synthesis function
async function synthesizeWithPolly(text, voice_id = 'Joanna') {
    try {
        console.log("Using Amazon Polly for text-to-speech...");
        
        // Your Polly API endpoint URL (update this to your actual server)
        const pollyApiUrl = 'http://localhost:5001/api/polly/synthesize';
        
        const response = await fetch(pollyApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                voice_id: voice_id,
                output_format: 'mp3'
            })
        });
        
        console.log("Polly API Response status:", response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Polly API Error response:", errorText);
            throw new Error(`Polly API failed: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log("Polly API Response data:", data);
        
        if (!data.success) {
            throw new Error(data.error || 'Polly synthesis failed');
        }
        
        return {
            audio_data: data.audio_data,
            content_type: data.content_type,
            voice_id: data.voice_id
        };
        
    } catch (error) {
        console.error("Polly synthesis failed:", error.message);
        // Fall back to browser TTS if Polly fails
        console.log("Falling back to browser TTS");
        throw new Error(`Polly synthesis failed: ${error.message}. Please check your AWS credentials and Polly service.`);
    }
}