chrome.runtime.onInstalled.addListener(() => {

  chrome.storage.sync.get(["geminikey"], (result) => {
    if (!result.geminiApiKey) {
      chrome.tabs.create({url:"options.html"})
    }

  });
  
});
