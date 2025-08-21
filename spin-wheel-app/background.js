// 확장프로그램 아이콘 클릭 시 새탭 열기
chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({
        url: chrome.runtime.getURL('index.html')
    });
});

// 설치 시 환영 페이지 열기
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        chrome.tabs.create({
            url: chrome.runtime.getURL('index.html')
        });
    }
});
