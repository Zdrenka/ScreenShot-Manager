document.body.onload = function() {
    refresh();
}

function refresh() {
    chrome.storage.sync.get(function(data) {
        for (key in data) {
            $("#" + key).attr("checked", data[key]);
        }
    });

    chrome.storage.local.get(null, function(keys) {
        if (!jQuery.isEmptyObject(keys)) {
            manageLocalData(keys);
        }
    });
}

function manageLocalData(keys) {
    var item;
    for (var id in keys) {
        if (keys[id].newValue != null)
            item = keys[id].newValue;
        else if (keys[id].oldValue != null)
            item = keys[id].oldValue;
        else
            item = keys[id];

        var id = "p" + item.number;
        populateImage(id, item.name, item.number);
        $("#" + id).attr("src", item.image);
    }
}

function reDownload(id) {
    chrome.downloads.download({
        url: $('#' + id).attr('src'),
        filename: id + ".png",
        saveAs: true
    });
}

function remove(id) {
    if (confirm('Are you sure you want to delete this schreenshot?')) {
        chrome.storage.local.remove(id, function(items) {
            $("#p" + id + "container").empty();
            console.log("removed");
        });
        chrome.storage.sync.get("counter", function(object) {
            var count = object["counter"];
            chrome.storage.sync.set({
                    "counter": count - 1
                },
                function() {
                    if (chrome.runtime.error) {
                        console.log("Runtime error.");
                    }
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

function populateImage(id, title, num) {
    if ($('#' + id).length == 0) {
        $("#shots").append("<div id='" + id + "container' style='float:left;'><div class='shots effect2'> " +
            "<img id='" + id + "' alt= '" + title + "' title='" + num + "' class='screen-shots img-thumbnail' >" +
            "<div class='overlay'>" +
            "<button id='" + id + "download' title='download' class='download-button material-icons'>file_download</button>" +
            "<button id='" + id + "remove' title='delete forever?!' class='download-button material-icons'>delete_forever</button>" +
            "</div>" +
            "<p style='text-align: center'>" + new Date().toLocaleString() + "</p>" +
            "</div>" +
            "</div>");

        document.getElementById(id + "download").addEventListener("click", function() {
            reDownload(id);
        });

        document.getElementById(id + "remove").addEventListener("click", function() {
            remove(num.toString());

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
