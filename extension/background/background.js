
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    if (request.action === 'summarize') {
        summarizeWithChatGPT(request.text)
            .then(result => {
                chrome.storage.local.set({
                    'currentSummary': {
                        summary: result.summary,
                        bulletPoints: result.bulletPoints,
                        timestamp: Date.now()
                    }
                });
                
                sendResponse({ 
                    success: true, 
                    summary: result.summary,
                    bulletPoints: result.bulletPoints
                });
            })
            .catch(error => {
                sendResponse({ 
                    success: false, 
                    error: error.message 
                });
            });
        
        return true;
    }
    
    if (request.action === "speakText" && request.text) {
        sendResponse({ 
            success: true, 
            text: request.text,
            action: "speakInPopup"
        });
        return true;
    }
    
    if (request.action === "updateSummary") {
        chrome.storage.local.set({
            currentSummary: {
                summary: request.summary,
                bulletPoints: request.bulletPoints || []
            }
        });
        return true;
    }
});

async function summarizeWithChatGPT(text) {
    try {
        const apiKey = "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";
        
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
        
        
        if (!response.ok) {
            const errorText = await response.text();
            return createFallbackSummary(text);
        }
        
        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error("Invalid OpenAI API response format");
        }
        
        const aiSummary = data.choices[0].message.content;
        const sentences = aiSummary.split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 10)
            .slice(0, 3);
        
        return {
            summary: aiSummary,
            bulletPoints: sentences
        };
        
    } catch (error) {
        return createFallbackSummary(text);
    }
}

function createFallbackSummary(text) {
    const sentences = text.split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 10);
    
    if (sentences.length <= 1) {
        return `Summary: ${text}`;
    }
    
    const importantSentences = [];
    
    importantSentences.push(sentences[0]);
    
    const importantKeywords = ['important', 'key', 'main', 'primary', 'essential', 'significant', 'crucial', 'notable', 'remarkable', 'major', 'critical'];
    const keywordSentences = sentences.filter(s => 
        importantKeywords.some(keyword => s.toLowerCase().includes(keyword))
    );
    
    if (keywordSentences.length > 0) {
        importantSentences.push(keywordSentences[0]);
    }
    
    const statSentences = sentences.filter(s => /\d+/.test(s));
    if (statSentences.length > 0 && !importantSentences.includes(statSentences[0])) {
        importantSentences.push(statSentences[0]);
    }
    
    if (sentences.length > 1 && !importantSentences.includes(sentences[sentences.length - 1])) {
        importantSentences.push(sentences[sentences.length - 1]);
    }
    
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

async function playAudioOffscreen(audioBlob) {
    try {
        if (await chrome.offscreen.hasDocument()) {
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
            await chrome.offscreen.createDocument({
                url: 'offscreen.html',
                reasons: ['AUDIO_PLAYBACK'],
                justification: 'Playing text-to-speech audio from ElevenLabs',
            });
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
    }
}