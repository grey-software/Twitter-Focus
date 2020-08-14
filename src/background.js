var currentURL = "https://twitter.com/home";
var port;
var focus = true;
chrome.runtime.onConnect.addListener(function (connectionPort) {
  console.assert(connectionPort.name == "TwitterFocus");
  port = connectionPort;
  if (focus) {
    port.postMessage({ status: "focus-home" });
  }
});



chrome.browserAction.onClicked.addListener(function () {
  if ((!currentURL.includes("/explore") && !currentURL.includes("/messages")) && currentURL.includes("twitter.com")) {
    if (!focus) {
      if (currentURL == "https://twitter.com/home") {
        port.postMessage({ status: "focus-home" });
      } else {
        port.postMessage({ status: "focus" })
      }
    } else {
      if (currentURL == "https://twitter.com/home") {
        port.postMessage({ status: "unfocus-home" });
      } else {
        port.postMessage({ status: "unfocus" });
      }
    }

    focus = !focus;
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url && changeInfo.url.includes("twitter.com")) {
    if (changeInfo.url.includes("twitter.com/home")) {
      if (focus) {
        port.postMessage({ status: "focus-home" });
      }
    } else if (focus && !changeInfo.url.includes("/explore") && !changeInfo.url.includes("/messages")) {
      port.postMessage({ status: "focus" });
    }else{
      port.postMessage({ status: "messages-explore" });
    }
    currentURL = changeInfo.url
  }

});
