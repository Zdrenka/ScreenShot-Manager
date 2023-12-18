let local = chrome.storage.local;
let sync = chrome.storage.sync;
let shots = [];

class Shot {
    constructor(name, data) {
        this.name = name.replace(/[^\w\s.]/gi, '');
        this.data = data;
        this.timestamp = new Date().toLocaleString();
    }
    save() {
        sync.get(['save_as', 'save_download', 'disable_auto'], items => {
            if (items['save_as']) {
                this.download(this.data, this.name, true);
            } else if (items['save_download']) {
                this.download(this.data, this.name, false);
            } else if (!items['disable_auto']) {
                this.download(this.data, this.name, false);
            }
        });
    }
    download(data, name, saveAs) {
        chrome.downloads.download({
            url: data,
            filename: name,
            saveAs: saveAs
        });
    }
}


chrome.action.onClicked.addListener((tab) => {
    // Check if the tab is complete, then send the message
    if (tab.status === "complete") {
        sendMessageToTab(tab.id);
    } else {
        // Listen for tab update if not complete
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
            if (tabId === tab.id && changeInfo.status === "complete") {
                sendMessageToTab(tab.id);
                // Remove this listener after sending the message
                chrome.tabs.onUpdated.removeListener(listener);
            }
        });
    }
});

function sendMessageToTab(tabId) {
    chrome.tabs.sendMessage(tabId, { action: "triggerCameraEffect" });
    chrome.tabs.captureVisibleTab(null, {
        format: "png"
    }, (data) => {
        let shot = new Shot(tab.title + ".jpg", data);
        shot.save();
        addToCollection(shot);
    });
}

function addToCollection(shot) {
    local.get(null, (images) => {
        shots = images.imgs || [];
        shots.push(shot);
        push();
    });
}

function push() {
    local.set({ imgs: shots }, () => {
        console.log("Image collection added to local storage");
    });
}