document.body.onload = function() {
    refresh();
}

function refresh() {
    chrome.storage.sync.get(function(data) {
        for (key in data) {
            $("#" + key).attr("checked", data[key]);
        }
        console.log("found sync data");
    });

    chrome.storage.local.get(null, function(images) {
        for (var i in images.imgs) {
            var shot = images.imgs[i];
            populateImage(i, shot);
            $("#p" + i).attr("src", shot.data);
        }
    });
}

//currently reloads all images - change so only missing images are loaded
function manageLocalData(shots) {
    if (shots.imgs.newValue != null) {
        for (var i in shots.imgs.newValue) {
            var shot = shots.imgs.newValue[i];
            populateImage(i, shot);
            $("#p" + i).attr("src", shot.data);
        }
    }
}

function reDownload(id) {
    chrome.downloads.download({
        url: $('#' + id).attr('src'),
        filename: id + ".png",
        saveAs: true
    });
}

function notifyBackground(event, data) {
    var port = chrome.extension.connect({
        name: event
    });
    port.postMessage(data);
}

function remove(id) {
    if (confirm('Are you sure you want to delete this schreenshot?')) {
        chrome.storage.local.get(null, function(images) {
            images.imgs.splice(id, 1);
            chrome.storage.local.set(images, function() {
                $("#p" + id + "container").addClass("animated hinge");
                $("#p" + id + "container").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    alert("finish");
                    $("#p" + id + "container").remove();
                });

                console.log("removed");
                notifyBackground("splice", id);
                location.reload();
            });
        });
    }
}

//gets and sets
chrome.storage.onChanged.addListener(function(key, namespace) {
    if (namespace == "local") {
        manageLocalData(key);
    }
});

function populateImage(index, shot) {
    var id = ('p' + index);
    if ($('#' + id).length == 0) {
        $("#shots").append("<div id='" + id + "container' style='float:left;'><div class='shots'> " +
            "<img id='" + id + "' alt= '" + shot.name + "' title='" + shot.name + "' class='screen-shots img-thumbnail' >" +
            "<div class='overlay animated fadei'>" +
            "<button id='" + id + "download' title='Download Image'   class='download-button material-icons'>file_download</button>" +
            "<button id='" + id + "remove'   title='delete forever?!' class='download-button material-icons'>delete_forever</button>" +
            "</div>" +
            "<p style='text-align: center'>" + shot.timestamp + "</p>" +
            "</div>" +
            "</div>");

        document.getElementById(id + "download").addEventListener("click", function() {
            reDownload(id);
        });
        document.getElementById(id + "remove").addEventListener("click", function() {
            remove(index.toString());
        });
    } else {
        chrome.storage.local.remove(id, function(items) {
            console.log("removed");
        });
    }
}

//set to auto download to download folder
document.getElementById("disable_auto").onclick = function() {
    var sa = document.getElementById('save_as').checked = false;
    var da = document.getElementById('disable_auto').checked;
    chrome.storage.sync.set({
        "save_as": sa,
        "disable_auto": da
    }, function() {
        if (chrome.runtime.error) {
            console.log("Runtime error.");
        }
    });
}

//set to define download directory and filename
document.getElementById("save_as").onclick = function() {
    var da = document.getElementById('disable_auto').checked = false;
    var sa = document.getElementById('save_as').checked;
    chrome.storage.sync.set({
        "save_as": sa,
        "disable_auto": da
    }, function() {
        if (chrome.runtime.error) {
            console.log("Runtime error.");
        }
    });
}

document.getElementById("mute").onclick = function() {
    var m = document.getElementById('mute').checked;
    chrome.storage.sync.set({
        "mute": m
    }, function() {
        if (chrome.runtime.error) {
            console.log("Runtime error.");
        }
    });
}
