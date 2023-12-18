chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    if (message.action === "triggerCameraEffect") {
        if (document.getElementById('temp_overlay') === null) {
            let overlay = document.createElement("div");
            overlay.id = 'temp_overlay';
            overlay.style.cssText = 'z-index: 3; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #fff; display: none;';
            document.body.appendChild(overlay);
        }
        flash();
        let audio = new Audio(chrome.runtime.getURL("cam.mp3"));
        audio.play();
    }
});

function flash() {
    let overlay = document.getElementById('temp_overlay');
    overlay.style.display = 'block';
    overlay.style.opacity = 0.7;

    setTimeout(() => {
        fadeOutEffect(overlay);
    }, 300);
}

function fadeOutEffect(element) {
    let fadeEffect = setInterval(() => {
        if (!element.style.opacity) {
            element.style.opacity = 1;
        }
        if (element.style.opacity > 0) {
            element.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
            element.style.display = 'none';
        }
    }, 30);
}
