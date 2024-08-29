chrome.storage.local.get(["clearMode", "advancedMode"], function (result) {
  if (result.clearMode) {
    chrome.runtime.sendMessage({ action: "clearHistory" });

    setInterval(() => {
      chrome.runtime.sendMessage({ action: "clearHistory" });
    }, 5000);
  }
  if (result.advancedMode) {
    chrome.runtime.sendMessage({ action: "clearHistoryWithFilter" });

    setInterval(() => {
      chrome.runtime.sendMessage({ action: "clearHistoryWithFilter" });
    }, 5000);
  }
});
