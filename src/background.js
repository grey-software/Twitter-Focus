
var focus = false;
var port;
chrome.runtime.onConnect.addListener(function(connectionPort){
    console.log("I am connected");
    console.assert(connectionPort.name == "TwitterFocus"); 
    port = connectionPort;
});

chrome.browserAction.onClicked.addListener(function(){
    if (!focus)
      port.postMessage({status: "focus"});
    else
      port.postMessage({status: "un-focus"});
    focus = !focus;
});

console.log("running background script");
