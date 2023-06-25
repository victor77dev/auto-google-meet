const ACCEPT = [
    'accept',
    '允許',
    '允许'
];

const WAIT = [
    'wait',
    '等待',
];

const EVERYONE = [
    'everyone',
    '所有人',
];

let autoAccept = true;

let userListOpened = false;

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

function findElement(node, textList) {
    const label = node.getAttribute('aria-label');
    if (textList.find((text) => label?.includes(text))) {
        return node;
    } else {
        return null;
    }
}

function clickUserList() {
    if (userListOpened) return;

    const buttonList = document.querySelectorAll('button');
    Array.from(buttonList)?.find((button) => {
        const list = findElement(button, EVERYONE);
        list?.click();
        userListOpened = true;

        if (list) {
            return true;
        }
    });
}

function checkNewJoiner() {
    const companionButton = Array.from(document.querySelectorAll('button'))
        .find((button) => button.innerText.toLowerCase().match('companion'));

    if (companionButton) {
        console.log('Not joined call yet');
        return;
    } else {
        console.log('joined call')
    }

    clickUserList();

    const acceptList = Array.from(document.querySelectorAll('div[role="list"]')).find((node) => {
        if (findElement(node, WAIT)) {
            return true;
        }
    });

    if (!acceptList) return;

    clickJoinButton(acceptList);
}

function clickJoinButton(element) {
    const userList = Array.from(element?.querySelectorAll('button'));

    userList.forEach((node) => {
        const acceptButton = findElement(node, ACCEPT);
        acceptButton?.click();
    });

    clickUserList();
    userListOpened = false;
}

document.body.addEventListener('DOMNodeInserted', debounce(() => {
    checkNewJoiner();
}, 1000));
