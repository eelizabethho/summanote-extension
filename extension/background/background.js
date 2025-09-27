// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'summarize') {
        // Call OpenAI API
        summarizeText(request.text)
            .then(result => {
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
        
        return true; // Keep connection open
    }
});

async function summarizeText(text) {
    const API_KEY = 'your-openai-api-key-here';
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that summarizes text. Provide a concise summary and 3-5 key bullet points.'
                },
                {
                    role: 'user',
                    content: `Please summarize this text: ${text}`
                }
            ],
            max_tokens: 500,
            temperature: 0.7
        })
    });
    
    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse response
    const lines = content.split('\n').filter(line => line.trim());
    const summary = lines.find(line => !line.startsWith('•') && !line.startsWith('-')) || lines[0] || content;
    const bulletPoints = lines.filter(line => line.startsWith('•') || line.startsWith('-'));
    
    return {
        summary: summary.trim(),
        bulletPoints: bulletPoints.map(point => point.replace(/^[•\-]\s*/, '').trim())
    };
}
