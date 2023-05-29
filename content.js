let autoAccept = true;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    if (message.action === 'enable') {
        autoAccept = true;
    } else if (message.action === 'disable') {
        autoAccept = false;
    }
});

function sendData(data) {
    chrome.runtime.sendMessage({ action: 'updatePopup', data });
}

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

function clickJoinButton() {
    const dialogDiv = document.querySelectorAll('div[role="dialog"]>div');


    if (!dialogDiv || dialogDiv.length === 0) return;

    console.log(autoAccept)
    const img = dialogDiv[0].querySelectorAll('img');

    if (!img || img.length === 0) return;

    if (img.length > 1) {
        //multiple users
    }

    const userImage = img[0];
    const name = userImage?.title;

    debounce(sendData({ name, userImage }), 1000);

    const searchButton = 'data-mdc-dialog-action';
    const acceptButton = dialogDiv[1].querySelector(`button[${searchButton}="accept"]`);
    const declineButton = dialogDiv[1].querySelector(`button[${searchButton}="decline"]`);

    acceptButton?.click();
}

// Check for the join button every second
document.body.addEventListener('DOMNodeInserted', clickJoinButton);
