// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Background script received message:", request);
    
    if (request.action === 'summarize') {
        // For now, just return a mock response
        const mockSummary = `Mock summary: ${request.text.substring(0, 50)}...`;
        
        console.log("Sending mock response:", mockSummary);
        sendResponse({ 
            success: true, 
            summary: mockSummary 
        });
        
        return true; // Keep connection open
    }
});