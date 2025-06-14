document.addEventListener("DOMContentLoaded", (e) => {
  chrome.storage.sync.get(["geminiApiKey"], ({ geminiApiKey }) => {
    if (geminiApiKey) document.getElementById("api-key").value = geminiApiKey;

    document.getElementById("save-button").addEventListener("click", (e) => {
      e.preventDefault();
      const apiKey = document.getElementById("api-key").value.trim();
      if (!apiKey || apiKey.length < 10) return;

      chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
        document.getElementById("success-message").style.opacity = "1";
        setTimeout(() => {
          window.close();
        }, 2000);
      });
    });
  });
});
