document.body.onload = function() {
    refresh();
};

function refresh() {
    chrome.storage.sync.get(function(data) {
        for (let key in data) {
            $("#" + key).prop("checked", data[key]);
        }
        console.log("Found sync data");
    });

    chrome.storage.local.get(null, function(images) {
        for (let i in images.imgs) {
            let shot = images.imgs[i];
            populateImage(i, shot);
            $("#p" + i).attr("src", shot.data);
        }
    });
}

function reDownload(id) {
    chrome.storage.local.get(null, function(images) {
        let shot = images.imgs[id];
        chrome.downloads.download({
            url: shot.data,
            filename: shot.name,
            saveAs: true
        });
    });
}

function notifyBackground(event, data) {
    chrome.runtime.sendMessage({ event: event, data: data });
}

function remove(id) {
    if (confirm('Are you sure you want to delete this screenshot?')) {
        chrome.storage.local.get(null, function(images) {
            images.imgs.splice(id, 1);
            chrome.storage.local.set(images, function() {
                $("#p" + id + "container").remove();
                console.log("Removed");
                notifyBackground("splice", id);
                location.reload();
            });
        });
    }
}

function expand(id) {
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("img01");
    var caption = document.getElementById("caption");
    modal.style.display = "block";

    chrome.storage.local.get(null, function (images) {
        var shot = images.imgs[id];
        modalImg.src = shot.data;
        caption.innerHTML = shot.name;
    });
    var download = document.getElementsByClassName("download")[0];
    var del = document.getElementsByClassName("delete")[0];

    del.onclick = function () {
        remove(id);
    }

    download.onclick = function () {
        reDownload(id);
    }

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }
}

//gets and sets
chrome.storage.onChanged.addListener(function(key, namespace) {
    if (namespace == "local") {
        refresh();
    }
});

function populateImage(index, shot) {
    var id = ('p' + index);
    if ($("#" + id + "container").length == 0) {
        $("#shots").append("<div id='" + id + "container' style='float:left;'><div class='shots effect2'> " +
            "<img id='" + id + "' alt= '" + shot.name + "' title='" + shot.name + "' class='screen-shots img-thumbnail' >" +
            "<div class='overlay animated fadei'>" +
            "<button id='" + id + "download' title='Download Image'   class='download-button material-icons'>file_download</button>" +
            "<button id='" + id + "remove'   title='delete forever?!' class='download-button material-icons'>delete_forever</button>" +
            "<button id='" + id + "expand'   title='View image' class='download-button material-icons'>fullscreen</button>" +
            "</div>" +
            "<p style='text-align: center'>" + shot.timestamp + "</p>" +
            "</div>" +
            "</div>");

        document.getElementById(id + "download").addEventListener("click", function() {
            reDownload(index);
        });
        document.getElementById(id + "remove").addEventListener("click", function() {
            remove(index.toString());
        });
        document.getElementById(id + "expand").addEventListener("click", function () {
            expand(index);
        });
    }
}

document.getElementById("disable_auto").addEventListener("click", function() {
    setOption('disable_auto');
});

document.getElementById("save_as").addEventListener("click", function() {
    setOption('save_as');
});

document.getElementById("mute").addEventListener("click", function() {
    setOption('mute');
});

function setOption(optionId) {
    let isChecked = document.getElementById(optionId).checked;
    let options = { "disable_auto": false, "save_as": false, "mute": false };
    options[optionId] = isChecked;
    
    chrome.storage.sync.set(options, function() {
        if (chrome.runtime.lastError) {
            console.log("Runtime error.");
        }
    });
}
