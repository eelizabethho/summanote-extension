// SUPER SIMPLE TEST - This should definitely work
console.log("🚀 SIMPLE TEST: Content script loaded!");

// Create a simple test popup that appears on the right side
function createSimpleTestPopup() {
    console.log("🚀 Creating simple test popup");
    
    // Remove any existing popup
    const existing = document.getElementById('simple-test-popup');
    if (existing) {
        existing.remove();
    }
    
    // Create popup element
    const popup = document.createElement('div');
    popup.id = 'simple-test-popup';
    popup.innerHTML = `
        <div style="
            background: #4b0082;
            color: white;
            padding: 20px;
            border-radius: 10px;
            max-width: 300px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        ">
            <h3 style="margin: 0 0 10px 0;">🎉 SUCCESS!</h3>
            <p style="margin: 0 0 15px 0;">This popup is on the RIGHT SIDE!</p>
            <button id="close-simple-test" style="
                background: white;
                color: #4b0082;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            ">Close</button>
        </div>
    `;
    
    // Position on RIGHT SIDE
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        z-index: 999999;
        background: rgba(0,0,0,0.5);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 20px;
    `;
    
    document.body.appendChild(popup);
    console.log("🚀 Simple test popup added to page");
    
    // Close button
    document.getElementById('close-simple-test').onclick = function() {
        console.log("🚀 Close button clicked");
        popup.remove();
    };
    
    // Close on background click
    popup.onclick = function(e) {
        if (e.target === popup) {
            console.log("🚀 Background clicked, closing");
            popup.remove();
        }
    };
}

// Add a visible test button to the page
function addTestButton() {
    console.log("🚀 Adding test button");
    
    const button = document.createElement('button');
    button.innerHTML = '🧪 TEST RIGHT SIDE POPUP';
    button.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999999;
        background: #4b0082;
        color: white;
        border: none;
        padding: 15px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        font-size: 14px;
        box-shadow: 0 4px 15px rgba(75, 0, 130, 0.3);
    `;
    
    button.onclick = function() {
        console.log("🚀 Test button clicked");
        createSimpleTestPopup();
    };
    
    document.body.appendChild(button);
    console.log("🚀 Test button added");
}

// Run when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addTestButton);
} else {
    addTestButton();
}

// Also test on text selection
document.addEventListener('mouseup', function() {
    const text = window.getSelection().toString().trim();
    console.log("🚀 Text selected:", text);
    
    if (text && text.length > 3) {
        console.log("🚀 Showing popup for selected text");
        createSimpleTestPopup();
    }
});

console.log("🚀 SIMPLE TEST: Script setup complete!");
