var local = chrome.storage.local;
var sync = chrome.storage.sync;
var shots = [];

function Shot(name, data) {
    this.name = name.replace(/[^\w\s.]/gi, '');
    this.data = data;
    this.timestamp = new Date().toLocaleString();
    this.save = function() {
        var image = new Image();
        image.onload = function() {
            var canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            var context = canvas.getContext("2d");
            context.drawImage(image, 0, 0);
        };
        sync.get(['save_as', 'save_download', 'disable_auto'], function(items) {
            if (items['save_as'] == true)
                saveAs(data, name);
            else if (items['save_download'] == true)
                download(data, name);
            else if (items['disable_auto'] == true)
                image.src = data;
            else
                download(data, name);
        });
    }
}

chrome.browserAction.onClicked.addListener(
    function(request, sender, sendResponse) {
        //flash! ahh ahhhh!
        cameraEffect(request);

        chrome.tabs.captureVisibleTab(null, {
            format: "png"
        }, function(data) {
            var shot = new Shot(request.title + ".jpg", data);
            shot.save();
            addToCollection(shot)
        });
    });

function addToCollection(shot) {
    local.get(null, function(images) {
        if (images.imgs == null) {
            shots[0] = shot;
        } else {
            shots = images.imgs;
            shots[images.imgs.length] = shot;
        }
        push();
    });
}

function push() {
    local.set({
        imgs: shots
    }, function() {
        console.log("image collection added to local storage");
    });
}

function cameraEffect(tab) {
    sync.get(['mute'], function(items) {
        if (!jQuery.isEmptyObject(items)) {
            if (items['mute'] == false) {
                playAudio();
            }
        } else {
            playAudio();
        }
    });

    if (tab.url.indexOf("chrome") == -1) {
        chrome.tabs.executeScript(null, {
            file: "jquery-3.1.1.min.js",
            allFrames: true,
            matchAboutBlank: true
        }, function() {
            if (chrome.runtime.error) {
                //  console.log("Runtime error.");
            } else {
                chrome.tabs.executeScript(null, {
                    file: "overlay.js",
                    allFrames: true,
                    matchAboutBlank: true
                }, function() {
                    if (chrome.runtime.error) {
                        console.log("Runtime error.");
                    }
                });
            }
        });
    }
}

chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(index) {
        switch (port.name) {
            case "splice":
                shots.splice(index, 1);
                console.log("removing index " + index + " from shot list");
                break;
            default:
                console.log("unknown message type");
        }
    });
});

function playAudio() {
    var myAudio = new Audio();
    myAudio.src = "cam.mp3";
    myAudio.play()
}

function download(data, name) {
    chrome.downloads.download({
        url: data,
        filename: name,
        saveAs: false
    });
}

function saveAs(data, name) {
    chrome.downloads.download({
        url: data,
        filename: name,
        saveAs: true
    });
}
