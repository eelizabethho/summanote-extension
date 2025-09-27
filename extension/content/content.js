console.log("SUMMANOTE: Content script loaded!");

// Simple function to remove existing tooltip
function removeTooltip() {
    const existing = document.getElementById('summarize-tooltip');
    if (existing) {
        existing.remove();
    }
}

// Simple function to show tooltip
function showTooltip(x, y, text) {
    console.log("SUMMANOTE: Showing tooltip at", x, y);
    
    // Remove any existing tooltip
    removeTooltip();
    
    // Create the button
    const button = document.createElement('div');
    button.id = 'summarize-tooltip';
    button.textContent = '📝 Summarize';
    
    // Set styles directly
    button.style.position = 'fixed';
    button.style.left = x + 'px';
    button.style.top = (y - 50) + 'px';
    button.style.backgroundColor = '#4f46e5'; // Nice blue color
    button.style.color = 'white';
    button.style.padding = '10px 15px';
    button.style.borderRadius = '6px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '999999';
    button.style.fontSize = '14px';
    button.style.fontWeight = '500';
    button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    button.style.border = 'none';
    button.style.userSelect = 'none';
    button.style.pointerEvents = 'auto';
    button.style.transition = 'all 0.2s ease';
    
    // Add click handler
    button.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("SUMMANOTE: Button clicked for text:", text);
        
        // Remove button first
        removeTooltip();
        
        // Send message to background script for summarization
        chrome.runtime.sendMessage({
            action: 'summarize',
            text: text
        }, function(response) {
            console.log("SUMMANOTE: Response received:", response);
            
            if (response && response.success) {
                console.log("SUMMANOTE: Summary received:", response.summary);
                
                // Create a nice popup to show the summary
                const summaryPopup = document.createElement('div');
                summaryPopup.id = 'summary-popup';
                summaryPopup.innerHTML = `
                    <div style="
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: white;
                        border: 2px solid #4b0082;
                        border-radius: 12px;
                        padding: 20px;
                        max-width: 500px;
                        max-height: 400px;
                        overflow-y: auto;
                        z-index: 1000000;
                        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                        font-family: Arial, sans-serif;
                    ">
                        <h3 style="margin: 0 0 10px 0; color: #4b0082; text-align: center;">📝 Summary</h3>
                        <p style="margin: 0; line-height: 1.6; color: #333; font-size: 14px;">${response.summary}</p>
                        <button id="close-summary" style="
                            position: absolute;
                            top: 10px;
                            right: 10px;
                            background: #ff4757;
                            color: white;
                            border: none;
                            border-radius: 50%;
                            width: 24px;
                            height: 24px;
                            cursor: pointer;
                            font-size: 12px;
                        ">×</button>
                    </div>
                `;
                
                document.body.appendChild(summaryPopup);
                
                // Add close functionality
                document.getElementById('close-summary').addEventListener('click', function() {
                    summaryPopup.remove();
                });
                
                // Close on outside click
                summaryPopup.addEventListener('click', function(e) {
                    if (e.target === summaryPopup) {
                        summaryPopup.remove();
                    }
                });
            } else {
                console.error("SUMMANOTE: Failed to get summary");
                alert("Sorry, couldn't generate a summary right now. Please try again.");
            }
        });
    };
    
    // Add to page
    document.body.appendChild(button);
    console.log("SUMMANOTE: Button added to page");
}

// Listen for text selection
document.addEventListener('mouseup', function(e) {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text.length > 5) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        showTooltip(rect.left + rect.width / 2, rect.top, text);
    }
});

// Listen for selection changes
document.addEventListener('selectionchange', function() {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text.length <= 5) {
        removeTooltip();
    }
});