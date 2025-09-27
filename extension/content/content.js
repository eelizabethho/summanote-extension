// Simple text selection and summarize button
document.addEventListener('mouseup', function() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    // Remove old button
    const oldButton = document.getElementById('summanote-button');
    if (oldButton) oldButton.remove();
    
    // Show button if text is selected
    if (!selection.isCollapsed && selectedText.length > 0) {
        showButton(selectedText);
    }
});

function showButton(selectedText) {
    // Get position of selected text
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Create button
    const button = document.createElement('button');
    button.id = 'summanote-button';
    button.textContent = '📝 Summarize';
    button.style.cssText = `
        position: fixed;
        top: ${rect.top - 40}px;
        left: ${rect.left}px;
        background: rgb(124, 49, 205);
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        z-index: 10000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;
    
    // Click handler
    button.addEventListener('click', function() {
        button.textContent = '⏳ Loading...';
        button.disabled = true;
        
        chrome.runtime.sendMessage({
            action: 'summarize',
            text: selectedText
        }, function(response) {
            if (response && response.success) {
                showResults(response.summary, response.bulletPoints);
            } else {
                alert('Failed to summarize text');
            }
            button.remove();
        });
    });
    
    document.body.appendChild(button);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (button.parentNode) button.remove();
    }, 8000);
}

function showResults(summary, bulletPoints) {
    // Remove old results
    const old = document.getElementById('summanote-results');
    if (old) old.remove();
    
    const popup = document.createElement('div');
    popup.id = 'summanote-results';
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border: 2px solid rgb(124, 49, 205);
        border-radius: 8px;
        padding: 15px;
        max-width: 400px;
        max-height: 70vh;
        overflow-y: auto;
        z-index: 10001;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        font-family: Arial, sans-serif;
        font-size: 14px;
    `;
    
    popup.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h3 style="margin: 0; color: rgb(124, 49, 205); font-size: 16px;">📝 Summary</h3>
            <button onclick="this.parentElement.parentElement.remove()" style="background: #ff4444; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 12px;">✕</button>
        </div>
        <div style="margin-bottom: 10px;">
            <strong>Summary:</strong><br>
            <div style="margin: 5px 0; line-height: 1.4;">${summary}</div>
        </div>
        <div>
            <strong>Key Points:</strong><br>
            <ul style="margin: 5px 0; padding-left: 15px; line-height: 1.4;">
                ${bulletPoints.map(point => `<li>${point}</li>`).join('')}
            </ul>
        </div>
    `;
    
    document.body.appendChild(popup);
}
