chrome.browserAction.onClicked.addListener(buttonClicked)

function buttonClicked(tab){
  console.log(tab);
  let msg = {
    txt: "focus"
  }
  chrome.tabs.sendMessage(tab.id, msg)
}



console.log("running background")
