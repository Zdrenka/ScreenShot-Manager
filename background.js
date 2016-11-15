var local = chrome.storage.local;
var sync = chrome.storage.sync;
var image_data = {};
var images_objects = {};
var screenshot = {
    content: document.createElement("canvas"),
    data: '',
};

chrome.browserAction.onClicked.addListener(
    function(request, sender, sendResponse) {
        //flash! ahh ahhhh!
        cameraEffect(request);
        chrome.tabs.captureVisibleTab(null, {
            format: "png"
        }, function(data) {
            screenshot.name = request.title + ".png";
            screenshot.data = data;
            saveImage();
            pushImage();
        });
    });


function pushImage() {
    sync.get("counter", function(data) {
        image_data = {
            image: screenshot.data,
            number: data['counter'],
            name: screenshot.name
        };
        if (image_data.number == null) {
            image_data.number = 1;
        }
        setCounter(image_data.number);
        images_objects[image_data.number] = image_data;
        local.set(images_objects);
        images_objects = {};
    });
}

function setCounter(counter) {
    if (counter == null) {
        sync.set({
            'counter': 1
        }, function() {});
    } else {
        if (counter >= 12) {
            counter = 0;
        }
        sync.set({
            'counter': counter + 1
        }, function() {});
    }
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

function playAudio() {
    var myAudio = new Audio();
    myAudio.src = "cam.mp3";
    myAudio.play()
}

function download(data, name) {
    chrome.downloads.download({
        url: screenshot.data,
        filename: screenshot.name,
        saveAs: false
    });
}

function saveAs(data, name) {
    chrome.downloads.download({
        url: screenshot.data,
        filename: screenshot.name,
        saveAs: true
    });
}

function saveImage() {
    var image = new Image();
    image.onload = function() {
        var canvas = screenshot.content;
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
    };
    sync.get(['save_as', 'save_download', 'disable_auto'], function(items) {
        if (items['save_as'] == true)
            saveAs(screenshot.data, screenshot.name);
        else if (items['save_download'] == true)
            download(screenshot.data, screenshot.name);
        else if (items['disable_auto'] == true)
            image.src = screenshot.data;
        else
            download(screenshot.data, screenshot.name);
    });
}
