 import { ScreenshotManagerDB } from '../db/screenshot-manager-db.js';

const screenshotManagerDB = new ScreenshotManagerDB();

// Define the Shot class
class Shot {
    constructor(name, data) {
        this.name = name.replace(/[^\w\s.]/gi, '');
        this.data = data;
        this.timestamp = new Date().toLocaleString();
    }

    async save() {
        try {
            const items = await getStorageItems(['save_as', 'save_download', 'disable_auto']);
            if (items.save_as) {
                this.download(this.data, this.name, true);
            } else if (items.save_download || !items.disable_auto) {
                this.download(this.data, this.name, false);
            }
        } catch (error) {
            console.error("Error in save:", error);
        }
    }

    download(data, name, saveAs) {
        chrome.downloads.download({
            url: data,
            filename: name,
            saveAs: saveAs
        });
    }
}

// Helper function to get storage items
function getStorageItems(keys) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(keys, (items) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(items);
            }
        });
    });
}

// Handle action click event
chrome.action.onClicked.addListener((tab) => {
    if (tab.status === "complete") {
        processTab(tab.id);
    } else {
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
            if (tabId === tab.id && changeInfo.status === "complete") {
                processTab(tab.id);
                chrome.tabs.onUpdated.removeListener(listener);
            }
        });
    }
});

// Function to process the tab
function processTab(tabId) {
    sendMessageToTab(tabId);
    captureAndSaveShot(tabId);
}

// Send message to tab
function sendMessageToTab(tabId) {
    chrome.tabs.sendMessage(tabId, { action: "triggerCameraEffect" }, () => {
        if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError.message);
        }
    });
}

// Capture the tab and save the shot
function captureAndSaveShot(tabId) {
    chrome.tabs.get(tabId, (tab) => {
        if (chrome.runtime.lastError) {
            console.error("Error getting the tab:", chrome.runtime.lastError.message);
            return;
        }

        chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, (data) => {
            if (chrome.runtime.lastError) {
                console.error("Error capturing the visible tab:", chrome.runtime.lastError.message);
                return;
            }

            const shot = new Shot(tab.title + ".jpg", data);
            shot.save();
            screenshotManagerDB.addToCollection(shot);
        });
    });
}
