let openPopup = false;

let joinList = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updatePopup') {
        if (openPopup) return;

        chrome.windows.getCurrent((currentWindow) => {
            if (!currentWindow || currentWindow.type !== 'popup') {
                chrome.windows.create({
                    url: 'popup.html',
                    type: 'popup',
                    width: 600,
                    height: 400
                });

                openPopup = true;
            }
        });
    }
  });
  