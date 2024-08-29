chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "clearHistory") {
    clearHistory();
  }
  if (request.action === "clearHistoryWithFilter") {
    clearHistoryWithFilter();
  }
});

function clearHistory() {
  const tenSecondsAgo = Date.now() - 10000;
  chrome.history.search(
    { text: "", startTime: tenSecondsAgo, maxResults: 1000 },
    (historyItems) => {
      historyItems.forEach((item) => {
        chrome.history.deleteUrl({ url: item.url });
      });
    }
  );
}

function clearHistoryWithFilter() {
  const tenSecondsAgo = Date.now() - 10000;
  chrome.history.search(
    { text: "", startTime: tenSecondsAgo, maxResults: 1000 },
    (historyItems) => {
      historyItems.forEach((item) => {
        console.log(item);
        chrome.storage.local.get(["blockList"], function ({ blockList }) {
          if (!blockList) blockList = [];
          blockList.forEach((blockedWebsite) => {
            if (item.url.includes(blockedWebsite)) {
              chrome.history.deleteUrl({ url: item.url });
            }
          });
        });
      });
    }
  );
}
