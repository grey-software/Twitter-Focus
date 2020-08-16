const PANEL_CLASS_NAME = '[aria-label="Timeline: Trending now"]'
const FEED_CONTAINER_CLASS_NAME = "css-1dbjc4n r-1jgb5lz r-1ye8kvj r-13qz1uu"
const FEED_LABEL = '[aria-label="Timeline: Your Home Timeline"]'
const BOTTOM_LABEL = "css-1dbjc4n r-1niwhzg r-1tlfku8 r-1ylenci r-1phboty r-1yadl64 r-ku1wi2 r-1udh08x"


const logoUrl = chrome.runtime.getURL("icon.png")
const gsLogoUrl = chrome.runtime.getURL("logo.png")
const paypalLogoUrl = chrome.runtime.getURL("paypal.png")

const port = chrome.runtime.connect({ name: "TwitterFocus" });
console.log(window.location.toString());
port.postMessage({url:  window.location.toString()});

var quoteFilled = false;

var initialLoad = true;


port.onMessage.addListener(function (msg) {
    switch (msg.status) {
        case "focus":
            blockPanel()
            break;
        case "unfocus":
            hideDistractions(false, false);
            break;
        case "focus-home":
            blockFeedAndPanel();
            break;
        case "unfocus-home":
            hideDistractions(false, true);
            break;
        case "messages-explore":
            quoteFilled = false;
            break;    
    }
});


function hideDistractions(shouldHide, homePage) {
    if (shouldHide) {
        if (homePage) {
            document.querySelector(FEED_LABEL).style.visibility = "hidden"
            fillQuote();
        }
        document.querySelector(PANEL_CLASS_NAME).style.visibility = "hidden";
        document.getElementsByClassName(BOTTOM_LABEL)[0].style.visibility = "hidden"
    } else {
        if (homePage) {
            document.querySelector(FEED_LABEL).style.visibility = "visible";
            var quote = document.getElementsByClassName(FEED_CONTAINER_CLASS_NAME)[1].children[0]
            quote.remove();
        }
        document.querySelector(PANEL_CLASS_NAME).style.visibility = "visible";
        document.getElementsByClassName(BOTTOM_LABEL)[0].style.visibility = "visible";
        quoteFilled = false;
    }
}


var intervalId;
var tryHideDistractions = true
function tryBlockingFeedPanel() {
    if (distractionsHidden(true)) {
        clearInterval(intervalId)
    } else {
        try {
            if (!quoteFilled) {
                hideDistractions(true, true);
            }
        } catch (err) {
            console.log("Feed hasn't been loaded yet");
        }

    }
}

function blockFeedAndPanel() {
    if (homePageHasLoaded()) {
        hideDistractions(true, true)
    } else {
        if(initialLoad){
            intervalId = setInterval(tryBlockingFeedPanel, 1000)
            initialLoad =  false;
        }else{
            intervalId = setInterval(tryBlockingFeedPanel, 100)
        }
    }
}

function tryBlockingPanel() {
    if (distractionsHidden(false)) {
        clearInterval(intervalId)
    } else {
        try {
            hideDistractions(true, false);
            quoteFilled = false;
        } catch (err) {
            console.log("Feed hasn't been loaded yet");
        }
    }
}

function blockPanel() {
    if (panelHasLoaded()) {
        hideDistractions(true, false)
    } else {
        intervalId = setInterval(tryBlockingPanel, 100)
    }
}

function fillQuote() {
    var quote = quotes[Math.floor(Math.random() * quotes.length)];

    const quoteStyle = "style=\"color:#293E4A;font-size:20px;\margin-bottom:4px;margin-left:10px;\""
    const tfTitleStyle = "style=\"color:#1DA1F2;font-size:28px;font-weight:700;margin-bottom:16px; margin-left:10px;\""
    const quoteSourceStyle = "style=\"color:#293E4A;font-size:20px;font-style:italic;margin-bottom:16px;margin-left:10px;\""
    const logoStyle = " style=\"height: 24px;margin: 0px 4px;\" "
    const instructionStyle = "style=\"color:#293E4A;font-size:16px;\margin-bottom:4px;margin-left:10px;\""
    const instruction = "To exit focus mode, click on the Twitter Focus extension:"

    var linkedInFocusHTML = "<h1 " + tfTitleStyle + ">Twitter Focus</h1>"
    linkedInFocusHTML += "<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css\"></link>"
    linkedInFocusHTML += "<p " + quoteStyle + ">" + quote.text + "</p>"
    linkedInFocusHTML += "<p " + quoteSourceStyle + ">- " + quote.source + "</p>"
    linkedInFocusHTML += "<p " + instructionStyle + ">" + instruction
    linkedInFocusHTML += "<img src=\"" + logoUrl + "\" " + logoStyle + ">" + " from the extensions panel on the top right corner of your screen.</p>"

    const quoteHtmlNode = document.createElement("div")
    quoteHtmlNode.innerHTML = linkedInFocusHTML


    document.getElementsByClassName(FEED_CONTAINER_CLASS_NAME)[1].prepend(quoteHtmlNode)
    document.getElementsByClassName(FEED_CONTAINER_CLASS_NAME)[1].style.fontFamily = "Arial, Helvetica";
    quoteFilled = true;

}
function distractionsHidden(isHomePage) {
    if (isHomePage) {
        if (homePageHasLoaded()) {
            return document.querySelector(PANEL_CLASS_NAME).style.visibility == "hidden" && document.querySelector(FEED_LABEL).style.visibility == "hidden";
        }
        return false;
    } else {
        if (panelHasLoaded()) {
            return document.querySelector(PANEL_CLASS_NAME).style.visibility == "hidden"
        } 
        return false;
    }
}


function homePageHasLoaded() {
    return panelHasLoaded() && feedHasLoaded();
}

function panelHasLoaded() {
    return document.querySelector(PANEL_CLASS_NAME)
}

function feedHasLoaded() {
    return document.querySelector(FEED_LABEL);

}