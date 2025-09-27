console.log("Content script loaded!");

let selectedText = '';

// get the selected text
function getSelectedText() {
    const selection = window.getSelection();
    return selection.toString().trim();
}

// Function to show Vanesha's beautiful tooltip
function showSummarizeOption(text) {
    console.log("Showing summarize option for text:", text);
    
    // Remove any existing tooltip
    removeTooltip();
    
    // Create Vanesha's beautiful tooltip with SummaNote branding
    const tooltip = document.createElement('div');
    tooltip.id = 'summarize-tooltip';
    tooltip.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #4b0082 0%, #4f46e5 100%); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">S</div>
            <span style="font-weight: 600; color: #4b0082;">SummaNote</span>
        </div>
    `;
    
    tooltip.style.cssText = `
        position: absolute;
        background: #f9f9ff;
        color: #4b0082;
        padding: 12px 16px;
        border-radius: 12px;
        font-size: 14px;
        cursor: pointer;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(75, 0, 130, 0.15);
        border: 2px solid #4b0082;
        transition: all 0.2s ease;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    // Position tooltip near selection
    const range = window.getSelection().getRangeAt(0);
    const rect = range.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - 50) + 'px';
    
    // Add hover effects matching Vanesha's design
    tooltip.addEventListener('mouseenter', () => {
        tooltip.style.transform = 'translateY(-2px)';
        tooltip.style.boxShadow = '0 8px 20px rgba(75, 0, 130, 0.25)';
        tooltip.style.background = '#f0f0ff';
    });
    
    tooltip.addEventListener('mouseleave', () => {
        tooltip.style.transform = 'translateY(0)';
        tooltip.style.boxShadow = '0 4px 12px rgba(75, 0, 130, 0.15)';
        tooltip.style.background = '#f9f9ff';
    });
    
    document.body.appendChild(tooltip);
    console.log("Tooltip added to page");
    
    tooltip.addEventListener('click', () => {
        console.log("Tooltip clicked, sending text to summarizer");
        sendTextToSummarizer(text);
        removeTooltip();
    });
}

// Function to remove tooltip
function removeTooltip() {
    const tooltip = document.getElementById('summarize-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Function to send text to background script for summarization
function sendTextToSummarizer(text) {
    console.log("Sending text to background script:", text);
    chrome.runtime.sendMessage({
        action: 'summarize',
        text: text
    }, (response) => {
        console.log("Received response from background script:", response);
        if (response && response.success) {
            showSummary(response.summary, response.bulletPoints);
        } else {
            showError(response.error || 'Failed to summarize text');
        }
    });
}

// Function to display Vanesha's beautiful summary popup
function showSummary(summary, bulletPoints) {
    console.log("Showing summary:", summary);
    
    // Remove any existing popup
    const existingPopup = document.getElementById('summary-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    const summaryPopup = document.createElement('div');
    summaryPopup.id = 'summary-popup';
    
    // Create bullet points HTML matching Vanesha's design
    const bulletPointsHTML = bulletPoints && bulletPoints.length > 0 
        ? `<div style="margin-top: 20px;">
             <h3 style="margin: 0 0 12px 0; color: #4b0082; font-size: 16px; font-weight: 600; text-align: center;">Bullet Points</h3>
             <ul style="margin: 0; padding-left: 0; list-style-position: inside; text-align: center; font-size: 14px; color: #333;">
               ${bulletPoints.map(point => `<li style="margin-bottom: 8px;">${point}</li>`).join('')}
             </ul>
           </div>`
        : '';
    
    summaryPopup.innerHTML = `
        <div style="background: #f9f9ff; border-radius: 16px; padding: 24px; max-width: 400px; box-shadow: 0 20px 60px rgba(75, 0, 130, 0.15); border: 2px solid #4b0082; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #4b0082 0%, #4f46e5 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold; margin-right: 12px;">S</div>
                <h2 style="margin: 0; color: #4b0082; font-size: 20px; font-weight: 600;">SummaNote Summary</h2>
            </div>
            <div style="background: linear-gradient(135deg, #d6ecf3 0%, #c8b6ff 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 12px 0; color: #4b0082; font-size: 16px; font-weight: 600; text-align: center;">Summary</h3>
                <p style="margin: 0; color: #333; line-height: 1.5; font-size: 14px; text-align: center;">${summary}</p>
            </div>
            ${bulletPointsHTML}
            <div style="display: flex; gap: 8px; margin-top: 20px; justify-content: center;">
                <button id="close-summary" style="background: #4f46e5; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500;">Close</button>
                <button id="speak-summary" style="background: #4b0082; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500;">🔊 Speak</button>
            </div>
        </div>
    `;
    
    summaryPopup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10001;
        background: rgba(0,0,0,0.5);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(summaryPopup);
    
    // Close button functionality
    document.getElementById('close-summary').addEventListener('click', () => {
        summaryPopup.remove();
    });
    
    // Speak button functionality (text-to-speech)
    document.getElementById('speak-summary').addEventListener('click', () => {
        const utterance = new SpeechSynthesisUtterance(summary);
        speechSynthesis.speak(utterance);
    });
    
    // Close on background click
    summaryPopup.addEventListener('click', (e) => {
        if (e.target === summaryPopup) {
            summaryPopup.remove();
        }
    });
}

// Function to show error message
function showError(error) {
    const errorPopup = document.createElement('div');
    errorPopup.id = 'error-popup';
    errorPopup.innerHTML = `
        <div style="background: #f9f9ff; border-radius: 12px; padding: 20px; max-width: 300px; box-shadow: 0 8px 20px rgba(220, 38, 38, 0.15); border: 2px solid #dc2626; font-family: 'Inter', sans-serif;">
            <h3 style="margin: 0 0 12px 0; color: #dc2626; font-size: 16px; font-weight: 600; text-align: center;">Error</h3>
            <p style="margin: 0; color: #333; font-size: 14px; text-align: center;">${error}</p>
            <button id="close-error" style="background: #dc2626; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-top: 12px; width: 100%;">Close</button>
        </div>
    `;
    
    errorPopup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10001;
        background: rgba(0,0,0,0.5);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(errorPopup);
    
    document.getElementById('close-error').addEventListener('click', () => {
        errorPopup.remove();
    });
}

// Listen for text selection
document.addEventListener('mouseup', function() {
    const text = getSelectedText();
    console.log("Text selected:", text, "Length:", text.length);
    
    if (text && text.length > 10) {
        selectedText = text;
        showSummarizeOption(text);
    } else {
        removeTooltip();
    }
});

// Listen for clicks to remove tooltip when clicking elsewhere
document.addEventListener('click', function(e) {
    if (!e.target.closest('#summarize-tooltip') && !e.target.closest('#summary-popup') && !e.target.closest('#error-popup')) {
        removeTooltip();
    }
});

// Listen for escape key to close popups
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        removeTooltip();
        const summaryPopup = document.getElementById('summary-popup');
        const errorPopup = document.getElementById('error-popup');
        if (summaryPopup) {
            summaryPopup.remove();
        }
        if (errorPopup) {
            errorPopup.remove();
        }
    }
});