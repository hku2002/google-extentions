chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({
        url: chrome.runtime.getURL('index.html')
    });
});

chrome.runtime.onInstalled.addListener(() => {
    console.log('Group Randomizer extension installed');
});
