var focus = true;
var port;
chrome.runtime.onConnect.addListener(function (connectionPort) {
    console.assert(connectionPort.name == "TwitterFocus");
    port = connectionPort;

    if (focus) {
        port.postMessage({status: "focus"});
    }

});

chrome.browserAction.onClicked.addListener(function(){
  if (!focus) {
    port.postMessage({status: "focus"});
  } else {
      port.postMessage({status: "unfocus"});
  } focus = ! focus;
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if(changeInfo.url == "https://twitter.com/home"){
    if (focus) {
      port.postMessage({status: "focus"});
    }
  }
});

