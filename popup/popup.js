let toggle = document.getElementById("noHistoryToggle");
let deleteAllHistoryButton = document.getElementById("deleteAllHistory");
let advancedFilterToggle = document.getElementById("advancedFilterToggle");
let advancedFilterInput = document.getElementById("advancedFilterInput");

chrome.storage.local.get(["clearMode", "advancedMode"], function (result) {
  toggle.checked = result.clearMode || false;
  advancedFilterToggle.checked = result.advancedMode || false;
  if (result.advancedMode) {
    advancedFilterInput.style.display = "block";
  }
});

toggle.addEventListener("change", function () {
  chrome.storage.local.set({ clearMode: this.checked });
  if (this.checked) {
    advancedFilterToggle.checked = false;
    advancedFilterToggle.dispatchEvent(new Event("change", { bubbles: true }));

    chrome.action.setBadgeText({ text: "ON" });
    chrome.action.setBadgeBackgroundColor({ color: "red" });
    chrome.action.setBadgeTextColor({ color: "white" });
  } else {
    chrome.action.setBadgeText({ text: "" });
  }
});

deleteAllHistoryButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all browsing history?")) {
    chrome.history.deleteAll(() => {
      alert("All browsing history has been deleted.");
    });
  }
});

advancedFilterToggle.addEventListener("change", function () {
  chrome.storage.local.set({ advancedMode: this.checked });

  if (this.checked) {
    advancedFilterInput.style.display = "block";
    toggle.checked = false;
    toggle.dispatchEvent(new Event("change", { bubbles: true }));
    chrome.action.setBadgeText({ text: "AD." });
    chrome.action.setBadgeBackgroundColor({ color: "red" });
    chrome.action.setBadgeTextColor({ color: "white" });
  } else {
    chrome.action.setBadgeText({ text: "" });
    advancedFilterInput.style.display = "none";
  }
});

advancedFilterInput.addEventListener("input", function () {
  const urls = this.value
    .split("\n")
    .map((url) => {
      try {
        return new URL(url.trim()).hostname;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const uniqueUrls = [...new Set(urls)];
  chrome.storage.local.set({ blockList: uniqueUrls });
});
chrome.storage.local.get(["blockList"], function (result) {
  if (result.blockList) {
    chrome.storage.local.get(["blockList"], function (result) {
  if (result.blockList) {
    const urlsWithHttps = result.blockList.map((url) => {
      if (!url.startsWith("https://")) {
        return "https://" + url;
      }
      return url;
    });

    advancedFilterInput.value = urlsWithHttps.join("\n");
  }
});
  }
});
