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

const JOIN = [
    'join',
    '加入',
];


let autoAccept = true;

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

function isUserListOpened() {
    const nameList = Array.from(document.querySelectorAll('div[role="list"]'));

    return checkVisible(nameList);
}

function openUserList() {
    if (isUserListOpened()) return;

    clickUserList();
}

function closeUserList() {
    if (!isUserListOpened()) return;

    clickUserList();
}

function clickUserList() {
    const buttonList = document.querySelectorAll('button');
    Array.from(buttonList)?.find((button) => {
        const list = findElement(button, EVERYONE);
        list?.click();

        if (list) {
            return true;
        }
    });
}

function checkVisible(ele) {
    const rect = ele?.getBoundingClientRect();
    if (rect?.width === 0 && rect?.height === 0) {
        return false;
    } else {
        return true;
    }
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

    // checkPendingJoiner();
    openUserList();

    const nameList = Array.from(document.querySelectorAll('div[role="list"]'));

    const acceptList = nameList?.find((node) => {
        if (findElement(node, WAIT)) {
            return true;
        }
    });

    if (!acceptList) return;

    clickJoinButton(acceptList);
    closeUserList();
}

function checkPendingJoiner() {
    const newJoinerNotification = document.querySelectorAll('div[style="bottom: 80px; right: 0px;"]')[0];

    if (findElement(newJoinerNotification, JOIN)) {
        return true;
    } else {
        return false;
    }
}

function clickJoinButton(element) {
    const userList = Array.from(element?.querySelectorAll('button'));

    userList.forEach((node) => {
        const acceptButton = findElement(node, ACCEPT);
        acceptButton?.click();
    });
}

document.body.addEventListener('DOMNodeInserted', debounce(() => {
    checkNewJoiner();
}, 1000));
