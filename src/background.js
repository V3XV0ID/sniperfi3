// Listen for messages from our extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkPhantom") {
    // Create a tab to check for Phantom
    chrome.tabs.create(
      { url: "https://phantom.app/ul/v1/connect", active: false },
      (tab) => {
        // Execute script in the tab to check for Phantom
        setTimeout(() => {
          chrome.scripting.executeScript(
            {
              target: { tabId: tab.id },
              function: () => {
                return !!window.solana?.isPhantom;
              },
            },
            (results) => {
              const hasPhantom = results?.[0]?.result || false;
              sendResponse({ hasPhantom });
              // Close the tab
              chrome.tabs.remove(tab.id);
            }
          );
        }, 1000); // Give the page time to load
      }
    );
    return true; // Keep the message channel open for async response
  }
});