function showOpenExtensionPopup() {
    const existingPopup = document.getElementById('summanote-open-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    const popup = document.createElement('div');
    popup.id = 'summanote-open-popup';
    popup.innerHTML = `
        <div class="open-extension-card">
            <div class="open-extension-content">
                <h3>AI Processing...</h3>
                <p>Your text is being summarized by AI. Click the SummaNote extension icon in your browser toolbar to view the results!</p>
                <button id="summanote-close-popup" class="close-btn">Got it!</button>
            </div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        #summanote-open-popup {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            z-index: 999999 !important;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        
        .open-extension-card {
            background: #f9f9ff !important;
            border-radius: 12px !important;
            border: 2px solid #4b0082 !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
            padding: 24px !important;
            max-width: 300px !important;
            text-align: center !important;
        }
        
        .open-extension-content h3 {
            color: #4b0082 !important;
            font-size: 18px !important;
            margin: 0 0 12px 0 !important;
            font-weight: 600 !important;
        }
        
        .open-extension-content p {
            color: #333 !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
            margin: 0 0 16px 0 !important;
        }
        
        .close-btn {
            background: linear-gradient(135deg, #4b0082 0%, #4f46e5 100%) !important;
            color: white !important;
            border: none !important;
            padding: 8px 16px !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            transition: all 0.3s ease !important;
        }
        
        .close-btn:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(75, 0, 130, 0.3) !important;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(popup);

    const closeBtn = document.getElementById('summanote-close-popup');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            popup.remove();
        });
    }

    setTimeout(() => {
        if (popup.parentNode) {
            popup.remove();
        }
    }, 5000);

    return popup;
}

function showSummarizationReadyPopup() {
    const existingPopup = document.getElementById('summanote-ready-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    const popup = document.createElement('div');
    popup.id = 'summanote-ready-popup';
    popup.innerHTML = `
        <div class="ready-extension-card">
            <div class="ready-extension-content">
                <h3>Summarization Ready!</h3>
                <p>Your AI summary is complete! Click the SummaNote extension icon in your browser toolbar to view the results.</p>
                <button id="summanote-close-ready-popup" class="close-btn">Got it!</button>
            </div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        #summanote-ready-popup {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            z-index: 999999 !important;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        
        .ready-extension-card {
            background: #f0f8ff !important;
            border-radius: 12px !important;
            border: 2px solid #4f46e5 !important;
            box-shadow: 0 8px 24px rgba(79, 70, 229, 0.3) !important;
            padding: 24px !important;
            max-width: 300px !important;
            text-align: center !important;
        }
        
        .ready-extension-content h3 {
            color: #4f46e5 !important;
            font-size: 18px !important;
            margin: 0 0 12px 0 !important;
            font-weight: 600 !important;
        }
        
        .ready-extension-content p {
            color: #333 !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
            margin: 0 0 16px 0 !important;
        }
        
        .close-btn {
            background: linear-gradient(135deg, #4f46e5 0%, #4b0082 100%) !important;
            color: white !important;
            border: none !important;
            padding: 8px 16px !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            transition: all 0.3s ease !important;
        }
        
        .close-btn:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3) !important;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(popup);

    const closeBtn = document.getElementById('summanote-close-ready-popup');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            popup.remove();
        });
    }

    setTimeout(() => {
        if (popup.parentNode) {
            popup.remove();
        }
    }, 5000);

    return popup;
}

function createSummarizeButton(selection) {
    const existingBtn = document.getElementById('summanote-summarize-btn');
    if (existingBtn) {
        existingBtn.remove();
    }

    const button = document.createElement('button');
    button.id = 'summanote-summarize-btn';
    button.innerHTML = 'Summarize';
    button.className = 'summanote-button';

    const style = document.createElement('style');
    style.textContent = `
        .summanote-button {
            position: fixed !important;
            background: linear-gradient(135deg, #4b0082 0%, #4f46e5 100%) !important;
            color: white !important;
            border: none !important;
            padding: 8px 16px !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            box-shadow: 0 4px 12px rgba(75, 0, 130, 0.3) !important;
            z-index: 999998 !important;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            transition: all 0.3s ease !important;
        }
        
        .summanote-button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 16px rgba(75, 0, 130, 0.4) !important;
        }
    `;

    document.head.appendChild(style);

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    const leftPos = rect.left + window.scrollX;
    const topPos = rect.top + window.scrollY - 40;
    
    button.style.left = leftPos + 'px';
    button.style.top = topPos + 'px';

    document.body.appendChild(button);

    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const selectedText = selection.toString().trim();
        
        showOpenExtensionPopup();
        
        try {
            chrome.runtime.sendMessage({
                action: "summarize",
                text: selectedText
            }, function(response) {
                if (chrome.runtime.lastError) {
                } else if (response && response.success) {
                    showSummarizationReadyPopup();
                } else {
                }
            });
        } catch (error) {
        }
        
        button.remove();
    });

    setTimeout(() => {
        if (button.parentNode) {
            button.remove();
        }
    }, 3000);

    return button;
}

document.addEventListener('mouseup', function() {
    setTimeout(() => {
        const selection = window.getSelection();
        const text = selection.toString().trim();
        
        if (text.length > 10) {
            createSummarizeButton(selection);
        }
    }, 100);
});

document.addEventListener('selectionchange', function() {
    setTimeout(() => {
        const selection = window.getSelection();
        const text = selection.toString().trim();
        
        if (text.length > 10) {
            createSummarizeButton(selection);
        }
    }, 100);
});

document.addEventListener('selectionchange', function() {
    setTimeout(() => {
        const selection = window.getSelection();
        const text = selection.toString().trim();
        
        if (text.length <= 10) {
            const existingBtn = document.getElementById('summanote-summarize-btn');
            if (existingBtn) {
                existingBtn.remove();
            }
        }
    }, 100);
});