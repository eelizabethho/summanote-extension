// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Background script received message:", request);
    
    if (request.action === 'summarize') {
        console.log("Starting AI summarization for text:", request.text.substring(0, 100) + "...");
        
        // Use AI summarization
        summarizeWithAI(request.text)
            .then(summary => {
                console.log("AI summary generated:", summary);
                sendResponse({ 
                    success: true, 
                    summary: summary 
                });
            })
            .catch(error => {
                console.error("AI summarization failed:", error);
                sendResponse({ 
                    success: false, 
                    error: error.message 
                });
            });
        
        return true; // Keep connection open for async response
    }
});

// AI summarization function
async function summarizeWithAI(text) {
    try {
        console.log("Creating AI summary...");
        
        // For now, return a mock response with bullet points and paragraph format
        const mockSummary = createMockSummary(text);
        return mockSummary;
        
    } catch (error) {
        console.error("AI summarization failed:", error.message);
        throw error;
    }
}

// Create mock summary with bullet points and paragraph format
function createMockSummary(text) {
    const words = text.split(' ').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Create a summary paragraph
    const summary = `This text discusses important concepts and provides valuable information. It contains ${words} words and covers ${sentences.length} main points. The content appears to be well-structured and informative, offering insights on the topic.`;
    
    // Create bullet points
    const bulletPoints = [
        `• The text contains ${words} words and ${sentences.length} sentences`,
        `• Key concepts are discussed with clear explanations`,
        `• The information is organized and easy to understand`
    ].join('\n');
    
    return `SUMMARY: ${summary}\n\nKEY POINTS:\n${bulletPoints}`;
}