var currentURL;
var port;
var focus = true;
chrome.runtime.onConnect.addListener(function (connectionPort) {
  console.assert(connectionPort.name == "TwitterFocus");
  port = connectionPort;
  port.onMessage.addListener(function(msg) {
    // if (msg.url.includes("twitter.com/home")) {
    //   if (focus) {
    //     port.postMessage({ status: "focus-home" });
    //   }
    // } else if (focus && !msg.url.includes("/explore") && !msg.url.includes("/messages")) {
    //   port.postMessage({ status: "focus" });
    // }else{
    //   port.postMessage({ status: "messages-explore" });
    // }
    console.log(msg.url);
    sendStatus(msg.url, port);
    currentURL = msg.url
  });
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
    // if (changeInfo.url.includes("twitter.com/home")) {
    //   if (focus) {
    //     port.postMessage({ status: "focus-home" });
    //   }
    // } else if (focus && !changeInfo.url.includes("/explore") && !changeInfo.url.includes("/messages")) {
    //   port.postMessage({ status: "focus" });
    // }else{
    //   port.postMessage({ status: "messages-explore" });
    // }
    sendStatus(changeInfo.url, port);
    currentURL = changeInfo.url
  }

});


function sendStatus(url, port){
  if (url.includes("twitter.com/home")) {
    if (focus) {
      port.postMessage({ status: "focus-home" });
    }
  } else if (focus && !url.includes("/explore") && !url.includes("/messages")) {
    port.postMessage({ status: "focus" });
  }else{
    port.postMessage({ status: "messages-explore" });
  }
}