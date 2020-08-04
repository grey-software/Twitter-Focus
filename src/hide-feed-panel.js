console.log("content script is good to go");

var panelClassName = "css-1dbjc4n r-1u4rsef r-9cbz99 r-1ylenci r-1phboty r-rs99b7 r-ku1wi2 r-1udh08x"
var feedClassName = "css-1dbjc4n r-1jgb5lz r-1ye8kvj r-13qz1uu"
var port = chrome.runtime.connect({name: "TwitterFocus"});

port.onMessage.addListener(function(msg) {
    console.log(msg.status);
    if(msg.status == "focus")
        setContentVisibility(false)
    else
        setContentVisibility(true);
});




function setContentVisibility(makeVisible){
    if(makeVisible){
        document.getElementsByClassName("css-1dbjc4n r-1u4rsef r-9cbz99 r-1ylenci r-1phboty r-rs99b7 r-ku1wi2 r-1udh08x")[0].style.visibility = "visible";
        document.getElementsByClassName("css-1dbjc4n r-1jgb5lz r-1ye8kvj r-13qz1uu")[1].style.visibility = "visible";
    }else{
        document.getElementsByClassName("css-1dbjc4n r-1u4rsef r-9cbz99 r-1ylenci r-1phboty r-rs99b7 r-ku1wi2 r-1udh08x")[0].style.visibility = "hidden"
        document.getElementsByClassName("css-1dbjc4n r-1jgb5lz r-1ye8kvj r-13qz1uu")[1].style.visibility  = "hidden";
    }
}





