let autoAccept = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    if (message.action === 'enable') {
        autoAccept = true;
    } else if (message.action === 'disable') {
        autoAccept = false;
    }
});

function debounce(func, delay) {
    let timeoutId;
  
    return function() {
        const context = this;
        const args = arguments;
    
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

const sendData = debounce((data) => {
    chrome.runtime.sendMessage({ action: 'updatePopup', data });
}, 1000);

function clickJoinButton() {
    const dialogDiv = document.querySelectorAll('div[role="dialog"]>div');

    if (!dialogDiv || dialogDiv.length === 0) return;

    console.log(autoAccept)
    const imgEle = dialogDiv[0].querySelectorAll('img');

    if (!imgEle || imgEle.length === 0) return;

    if (imgEle.length > 1) {
        //multiple users
    }

    const userImage = imgEle[0];
    const img = userImage?.src;
    const name = userImage?.title;

    sendData({ name, img });

    const searchButton = 'data-mdc-dialog-action';
    const acceptButton = dialogDiv[1].querySelector(`button[${searchButton}="accept"]`);
    const declineButton = dialogDiv[1].querySelector(`button[${searchButton}="decline"]`);

    if (autoAccept) {
        acceptButton?.click();
    }
}

// Check for the join button every second
document.body.addEventListener('DOMNodeInserted', clickJoinButton);
