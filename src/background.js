// background.js - Handles communication between content script and backend

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'summarize') {
        // For now, just return a mock response
        // Later you'll connect this to your Python backend
        const mockSummary = `Summary: ${request.text.substring(0, 50)}...`;
        
        sendResponse({ summary: mockSummary });
        return true; // Keep the message channel open for async response
    }
});