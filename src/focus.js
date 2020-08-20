const PANEL_CLASS_NAME = '[aria-label="Timeline: Trending now"]'
const FEED_CONTAINER_CLASS_NAME = "css-1dbjc4n r-1jgb5lz r-1ye8kvj r-13qz1uu"
const FEED_LABEL = '[aria-label="Timeline: Your Home Timeline"]'
const BOTTOM_LABEL = "css-1dbjc4n r-1niwhzg r-1tlfku8 r-1ylenci r-1phboty r-1yadl64 r-ku1wi2 r-1udh08x"


const logoUrl = chrome.runtime.getURL("icon.png")
const gsLogoUrl = chrome.runtime.getURL("logo.png")
const paypalLogoUrl = chrome.runtime.getURL("paypal.png")

const port = chrome.runtime.connect({ name: "TwitterFocus" });
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
    const gsTitleStyle = "style=\"color:#434343;font-size:32px;font-weight:700;margin-right:auto;\""
    const gsGithubStyle = "style=\"height: 32px;width: 32px;font-size: 32px;margin: 0px 6px;\""
    const gsSocialLinkedInStyle = "style=\"background: #007bb5;color: white;height: 25px;width: 25px;font-size: 24px;margin: 0px 6px;padding: 6px;border-radius:4px;\""
    const gsDesc = "This web extension was developed by Grey Software. Grey Software is a non-profit organization that aims to create the open source ecosystem of the future where software maintainers mentor students and build free software together!"
    const hyperlinkStyle = "<style>a{text-decoration: none;color: black;} a:visited{text-decoration: none;color: black;} a:hover{text-decoration: none !important;opacity: 0.7;} </style>"
    const paypalButtonStyle = "<style>.paypal-icon{height:24px;margin-right:4px}.paypal-button{border-radius:24px;height:42px;border:1px solid #003084;outline:none;display:flex;align-items:center;padding:2px 16px;color:#003084;font-size:18px;background-color:white;transition:all 0.3s ease-out}.paypal-button:hover{cursor:pointer;border:1px solid #1ba0de}.paypal-button:active{cursor:pointer;border:1px solid #1ba0de;color:white;background-color:#003084}</style>"
    const gsCta = "To learn more, please visit the Grey Software website at "


    var linkedInFocusHTML = "<h1 " + tfTitleStyle + ">Twitter Focus</h1>"
    linkedInFocusHTML += "<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css\"></link>"
    linkedInFocusHTML += "<p " + quoteStyle + ">" + quote.text + "</p>"
    linkedInFocusHTML += "<p " + quoteSourceStyle + ">- " + quote.source + "</p>"
    linkedInFocusHTML += "<p " + instructionStyle + ">" + instruction
    linkedInFocusHTML += "<img src=\"" + logoUrl + "\" " + logoStyle + ">" + " from the extensions panel on the top right corner of your screen.</p>"
    linkedInFocusHTML += "<br>"
    
    linkedInFocusHTML += "<div style=\"border: 2px;border-style:solid;border-color:#434343;padding: 1em;width: 552px;height: 200px;margin-top: 24px;margin-left:4px;padding-top:24px;border-radius:4px;\">"
    linkedInFocusHTML += "<div style=\"display: flex; align-items: center;margin-bottom:16px; margin-top: 1px;\">"
    linkedInFocusHTML += "<img src=\"" + gsLogoUrl + "\" style=\"height: 50px;float:left;margin-right: 6px;\" />"
    linkedInFocusHTML += "<span " + gsTitleStyle + ">Grey Software</span>"
    linkedInFocusHTML += "<a " + gsSocialLinkedInStyle + " href=\"https://www.linkedin.com/company/grey-software/\" class=\"fa fa-linkedin\"></a>"
    linkedInFocusHTML += "<a " + gsGithubStyle + " href=\"https://github.com/grey-software\" class=\"fa fa-github\"></a>"
    linkedInFocusHTML += "<a target=\"_blank\" href=\"https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VEAGAZP7DHJNE&source=url\"><button class=\"paypal-button\"><img class=\"paypal-icon\" src=\"https://assets.codepen.io/853141/paypal.png\"/>Donate</button></a></div>"
    linkedInFocusHTML += hyperlinkStyle
    linkedInFocusHTML += paypalButtonStyle
    linkedInFocusHTML += "<div>" + gsDesc + "<p style=\"margin-top: 12px;\">" + gsCta + "</p><a href=\"https://org.grey.software/\">grey.software</a></div>"
    linkedInFocusHTML += "</div>"

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