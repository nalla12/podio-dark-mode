// Function to toggle mode (called from background script)
function toggleDarkMode(enable) {
    if (enable) {
        applyDarkMode();
    } else {
        removeDarkMode();
    }
}

// Apply dark mode
function applyDarkMode() {
    // Remove existing style element if any
    removeDarkMode();

    // Create new style element
    const style = document.createElement('style');
    style.id = 'podio-dark-mode';

    // Inject CSS (loaded from file)
    fetch(chrome.runtime.getURL('dark-mode.css'))
        .then(response => response.text())
        .then(css => {
            style.textContent = css;
            document.head.appendChild(style);
        })
        .catch(err => console.error('Error loading dark mode:', err));
}

// Remove dark mode
function removeDarkMode() {
    const style = document.getElementById('podio-dark-mode');
    if (style) {
        style.remove();
    }
}

// Listen for messages from background script (alternative approach)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleMode") {
        toggleDarkMode(request.enable);
    }
});
