import { ScreenshotManagerDB } from './screenshot-manager-db.js';
const screenshotManagerDB = new ScreenshotManagerDB();

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
    screenshotManagerDB.getAllShots((shots) => {
        console.log(shots);
    });
    
}
