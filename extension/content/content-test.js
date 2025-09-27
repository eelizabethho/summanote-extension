console.log("TEST: Content script loaded!");
console.log("TEST: SummaNote extension is active and ready!");

// Simple test function
function showTestPopup() {
    console.log("TEST: Creating test popup");
    
    // Remove any existing popup
    const existingPopup = document.getElementById('test-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    const testPopup = document.createElement('div');
    testPopup.id = 'test-popup';
    testPopup.innerHTML = `
        <div style="background: #f9f9ff; border-radius: 16px; padding: 24px; max-width: 400px; box-shadow: 0 20px 60px rgba(75, 0, 130, 0.15); border: 2px solid #4b0082; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #4b0082 0%, #4f46e5 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold; margin-right: 12px;">S</div>
                <h2 style="margin: 0; color: #4b0082; font-size: 20px; font-weight: 600;">TEST POPUP - RIGHT SIDE</h2>
            </div>
            <div style="background: linear-gradient(135deg, #d6ecf3 0%, #c8b6ff 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <p style="margin: 0; color: #333; line-height: 1.5; font-size: 14px; text-align: center;">This popup should appear on the RIGHT SIDE of the screen!</p>
            </div>
            <div style="display: flex; gap: 8px; margin-top: 20px; justify-content: center;">
                <button id="close-test" style="background: #4f46e5; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 500;">Close</button>
            </div>
        </div>
    `;
    
    // Position on RIGHT SIDE
    testPopup.style.cssText = `
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        z-index: 10001;
        background: rgba(0,0,0,0.5);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 20px;
    `;
    
    document.body.appendChild(testPopup);
    console.log("TEST: Popup added to page");
    
    // Close button functionality
    document.getElementById('close-test').addEventListener('click', () => {
        console.log("TEST: Close button clicked");
        testPopup.remove();
    });
    
    // Close on background click
    testPopup.addEventListener('click', (e) => {
        if (e.target === testPopup) {
            console.log("TEST: Background clicked, closing popup");
            testPopup.remove();
        }
    });
}

// Listen for text selection
document.addEventListener('mouseup', function() {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    console.log("TEST: Text selected:", text, "Length:", text.length);
    
    if (text && text.length > 5) {
        console.log("TEST: Showing test popup for text:", text);
        showTestPopup();
    }
});

// Add a test button to the page
document.addEventListener('DOMContentLoaded', function() {
    console.log("TEST: DOM loaded, adding test button");
    
    const testButton = document.createElement('button');
    testButton.innerHTML = '🧪 TEST POPUP (RIGHT SIDE)';
    testButton.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 10000;
        background: #4b0082;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
    `;
    
    testButton.addEventListener('click', function() {
        console.log("TEST: Test button clicked");
        showTestPopup();
    });
    
    document.body.appendChild(testButton);
    console.log("TEST: Test button added to page");
});

console.log("TEST: Content script setup complete!");
