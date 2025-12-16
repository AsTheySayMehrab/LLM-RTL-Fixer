document.addEventListener('DOMContentLoaded', () => {
    const sizeInput = document.getElementById('fontSize');
    const sizeDisplay = document.getElementById('sizeValue');
    const heightInput = document.getElementById('lineHeight');
    const heightDisplay = document.getElementById('lineValue');

    // Load saved settings from Chrome storage
    chrome.storage.local.get(['prefFontSize', 'prefLineHeight'], (data) => {
        if (data.prefFontSize) {
            sizeInput.value = data.prefFontSize;
            sizeDisplay.textContent = data.prefFontSize + 'px';
        }
        if (data.prefLineHeight) {
            heightInput.value = data.prefLineHeight;
            heightDisplay.textContent = data.prefLineHeight;
        }
    });

    // Function to save and broadcast settings
    const updateSettings = () => {
        const size = sizeInput.value;
        const height = heightInput.value;

        // Update UI
        sizeDisplay.textContent = size + 'px';
        heightDisplay.textContent = height;

        // Save to storage
        chrome.storage.local.set({ 
            prefFontSize: size, 
            prefLineHeight: height 
        });

        // Send message to active tab content script
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: "UPDATE_SETTINGS",
                    fontSize: size,
                    lineHeight: height
                });
            }
        });
    };

    // Event Listeners
    sizeInput.addEventListener('input', updateSettings);
    heightInput.addEventListener('input', updateSettings);
});