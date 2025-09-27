console.log("🚀 Summanote Extension loaded on:", window.location.href);

// Create a visual indicator that the extension is working
const indicator = document.createElement('div');
indicator.id = 'summanote-indicator';
indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background:rgb(124, 49, 205);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-family: Arial, sans-serif;
    font-size: 12px;
    z-index: 10000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
`;
indicator.textContent = '📝 Summanote Active';
document.body.appendChild(indicator);

// Remove indicator after 3 seconds
setTimeout(() => {
    if (indicator.parentNode) {
        indicator.remove();
    }
}, 3000);

function handleTextSelection() {
    let selection = window.getSelection();
    let selectedText = selection.toString().trim();
    
    console.log("🖱️ Text selected:", selectedText);
    
    if (!selection.isCollapsed && selectedText.length > 0) {
        console.log("✅ Text selected, showing summarize button...");
        
        // Remove any existing button
        const existingButton = document.getElementById('summanote-button');
        if (existingButton) {
            existingButton.remove();
        }
        
        // Create summarize button
        showSummarizeButton(selectedText);
    } else {
        // Remove button if no text selected
        const existingButton = document.getElementById('summanote-button');
        if (existingButton) {
            existingButton.remove();
        }
    }
}

function showSummarizeButton(selectedText) {
    // Get the selection position
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Create the summarize button
    const button = document.createElement('button');
    button.id = 'summanote-button';
    button.textContent = '📝 Summarize Text';
    button.style.cssText = `
        position: fixed;
        top: ${rect.top - 50}px;
        left: ${rect.left}px;
        background: rgb(124, 49, 205);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        z-index: 10001;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
    `;
    
    // Add hover effects
    button.addEventListener('mouseenter', function() {
        button.style.background = 'rgb(100, 40, 180)';
        button.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        button.style.background = 'rgb(124, 49, 205)';
        button.style.transform = 'translateY(0)';
    });
    
    // Add click handler
    button.addEventListener('click', function() {
        console.log('📝 Summarizing text:', selectedText);
        
        // For now, show an alert with the selected text
        // Later you can connect this to your backend
        alert(`Selected text to summarize:\n\n"${selectedText}"`);
        
        // Remove the button after clicking
        button.remove();
    });
    
    document.body.appendChild(button);
    
    // Auto-remove button after 10 seconds
    setTimeout(() => {
        if (button.parentNode) {
            button.remove();
        }
    }, 10000);
}

document.addEventListener('mouseup', handleTextSelection);
