// Timer
let startTime;
let passedTime;
let timeOut; // Displays chrome notification
const opt = {
  type: 'basic',
  title: 'Take a break!',
  message:
    'It\'s time to take a break!'
};


chrome.tabs.onUpdated.addListener((tabId, tab) => {
    chrome.storage.sync.get('isFocusModeEnabled', (obj) => {
      /** check if Break Mode is on */
      if (obj.isFocusModeEnabled) {
        if (tab.status == 'complete') {
          chrome.tabs.executeScript(tabId, {
            file: 'siteBlocker.bundle.js',
          });
        }
      }
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.msg) {
      case 'start':
        startTime = Date.now();
        passedTime = 0;
        chrome.storage.sync.get('initClockTime', (obj) => {
        if (obj) {
            timeOut = setTimeout(
              () => chrome.notifications.create('fm-end', opt),
              obj.initClockTime
            );
        }
        });
      case 'get':
        passedTime = Date.now() - startTime;
        sendResponse({ time: passedTime });
      case 'end':
        window.clearTimeout(timeOut);
  }
});