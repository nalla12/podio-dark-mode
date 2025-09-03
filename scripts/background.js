let darkModeEnabled = false;

function updateToolbarIcon(isDark) {
    chrome.action.setBadgeText({
        text: isDark ? "ON" : "OFF",
    });
}

async function toggleDarkMode(enable, tabId) {
    if (enable) {
        await chrome.scripting.insertCSS({
            files: ["styles/dark-mode.css"],
            target: { tabId: tabId },
        });
    } else {
        await chrome.scripting.removeCSS({
            files: ["styles/dark-mode.css"],
            target: { tabId: tabId },
        });
    }
}

// Listen for toolbar button clicks
chrome.action.onClicked.addListener(async (tab) => {
    // Check if the tab is a Podio domain
    if (tab.url && tab.url.includes('podio.com')) {
        darkModeEnabled = !darkModeEnabled;
        chrome.storage.local.set({ podioDarkMode: darkModeEnabled });
        await toggleDarkMode(darkModeEnabled, tab.id);
        updateToolbarIcon(darkModeEnabled);
    }
});

// Listen for tab updates to maintain mode state
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    console.log('Tab was updated:', tab);
    if (tab.url && tab.url.includes('podio.com')) {
        console.log('Tab is a Podio domain');
        const result = await chrome.storage.local.get('podioDarkMode');
        const isDark = result.podioDarkMode || false;
        console.log('Storage result:', result);

        if (isDark) {
            await toggleDarkMode(darkModeEnabled, tab.id);
        }

        updateToolbarIcon(isDark);
    }
});
