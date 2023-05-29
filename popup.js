chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updatePopup') {
        console.log(message)
        const user = document.createElement('div');
        const name = document.createElement('div');
        name.innerHTML = message.data.name;
        const img = document.createElement('img');
        img.src = message.data.img;
        img.height = 48;
        img.width = 48;

        user.appendChild(name);
        user.appendChild(img);

        document.getElementById('list').appendChild(user);
    }
});
  

window.onload = () => {
    const enable = document.getElementById('enable');
    const storedData = localStorage.getItem('ENABLE_AUTO_ACCEPT');

    if (storedData === 'true') {
        enable.checked = true;
    } else {
        enable.checked = false;
    }

    enable.addEventListener('click', () => {
        localStorage.setItem('ENABLE_AUTO_ACCEPT', enable.checked);
        console.log(enable.checked);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: enable.checked ? 'enable' : 'disable' });
        });
    });
}
