var counter = 1;
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
        cameraEffect();
        chrome.tabs.captureVisibleTab(null, {
            format: "png"
        }, function(data) {
            screenshot.name = request.title + ".png";
            screenshot.data = data;
            saveImage();
            if (counter >= 13) {
                counter = 1;
            }
            image_data = {
                image: data,
                number: counter,
                name: request.title
            };
            images_objects[counter] = image_data;
            local.set(images_objects);
            images_objects = {};
            counter++;
        });
    });

function cameraEffect() {
    sync.get(['mute'], function(items) {
        if (!jQuery.isEmptyObject(items)) {
            if (items['mute'] == false) {
                playAudio();
            }
        } else {
            playAudio();
        }

    });

    //Cannot insert code into chrome:// pages
    chrome.tabs.executeScript(null, {
        file: "jquery-3.1.1.min.js"
    }, function() {
        chrome.tabs.executeScript(null, {
            file: "overlay.js"
        });
    });

}

function playAudio() {
    var myAudio = new Audio();
    myAudio.src = "cam.mp3";
    myAudio.play()
}

function download(data, name) {
    chrome.downloads.download({
        url: screenshot.data,
        filename: screenshot.name
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
