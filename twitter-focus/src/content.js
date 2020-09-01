const PANEL_CLASS_NAME = '[aria-label="Timeline: Trending now"]'
const FEED_CONTAINER_CLASS_NAME = "section[aria-labelledby^=accessible-list]"
const FEED_LABEL = '[aria-label="Timeline: Your Home Timeline"]'
const BOTTOM_LABEL = "css-1dbjc4n r-1niwhzg r-1tlfku8 r-1ylenci r-1phboty r-1yadl64 r-ku1wi2 r-1udh08x"
const MAIN_CONTAINER_CLASSNAME = "css-1dbjc4n r-13awgt0 r-12vffkv";

const logoUrl = chrome.runtime.getURL("icons/icon.png")
const gsLogoUrl = chrome.runtime.getURL("icons/logo.png")
const linkedInURL = chrome.runtime.getURL("icons/linkedin-brands.svg")
const githubLogoURL = chrome.runtime.getURL("icons/github-square-brands.svg")
const paypalLogoUrl = chrome.runtime.getURL("icons/paypal.png")
const githubLogoUrl = chrome.runtime.getURL("icons/github.svg")
const linkedinLogoUrl = chrome.runtime.getURL("icons/linkedin.svg")

const port = chrome.runtime.connect({ name: "TwitterFocus" });
port.postMessage({url:  window.location.toString()});

var quoteFilled = false;

var initialLoad = true;

var focus = false; 
window.addEventListener("resize", hidePanelOnResize);


function hidePanelOnResize(){
    if (focus){
        tryBlockingPanel();
    }
}

port.onMessage.addListener(function (msg) {
    switch (msg.status) {
        case "focus":
            blockPanel()
            focus = true;
            break;
        case "unfocus":
            // hideDistractions(false, true, false);
            // displayPanel(true)
            hideDistractions(false,false);
            focus = false;
            break;
        case "focus-home":
            blockFeedAndPanel();
            focus = true;
            break;
        case "unfocus-home":
            hideDistractions(false, true);
            focus = false;
            break;
        case "messages-explore":
            quoteFilled = false;
            break;    
    }
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Once we receive a message from the popup
    if (request.msg) {
      // If message has the `action` key `print_in_console`
        if (request.msg.action === "block feed") {
            displayFeed(false)
        } else if (request.msg.action === "un-block feed") {
            displayFeed(true)
        } else if (request.msg.action === "block panel") {
            displayPanel(false)
        } else{
            displayPanel(true)
        }
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
        if (homepage) {
            document.querySelector(FEED_LABEL).style.visibility = "visible";
            var quote = document.querySelectorAll(FEED_CONTAINER_CLASS_NAME)[0].children[0]
            quote.remove();
        }
        document.querySelector(PANEL_CLASS_NAME).style.visibility = "visible";
        document.getElementsByClassName(BOTTOM_LABEL)[0].style.visibility = "visible";
        quoteFilled = false;
    }
}

function displayPanel(shouldDisplay){
    if(shouldDisplay){
        document.querySelector(PANEL_CLASS_NAME).style.visibility = "visible";
        document.getElementsByClassName(BOTTOM_LABEL)[0].style.visibility = "visible";
        quoteFilled = false;
    }else{
        document.querySelector(PANEL_CLASS_NAME).style.visibility = "hidden";
        document.getElementsByClassName(BOTTOM_LABEL)[0].style.visibility = "hidden"
    }

}

function displayFeed(shouldDisplay){
    if(shouldDisplay){
        document.querySelector(FEED_LABEL).style.visibility = "visible";
        var quote = document.querySelectorAll(FEED_CONTAINER_CLASS_NAME)[0].children[0]
        quote.remove();
    }else{
        document.querySelector(FEED_LABEL).style.visibility = "hidden"
        fillQuote();
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
    console.log(document.body.style.backgroundColor)
    console.log(document.body.style.backgroundColor == "#000000")
    console.log(document.body.style.backgroundColor == "#15202B")
    var instructionColour = "#293E4A"
    var gsTextColour = "#000000"
    if(document.body.style.backgroundColor == "rgb(0, 0, 0)"){
        console.log("I am in dim or dark mode")
        instructionColour = "#FFFFFF"
        gsTextColour = "#FFFFFF"
    }else{
        console.log("I am in light mode");
    }
    var quote = quotes[Math.floor(Math.random() * quotes.length)];

    const quoteStyle = "style=\"color:" + instructionColour + ";font-size:20px;\margin-bottom:4px;\""
    const tfTitleStyle = "style=\"color:#1DA1F2;font-size:28px;font-weight:700;margin-bottom:16px; \""
    const quoteSourceStyle = "style=\"color:"+ instructionColour + ";font-size:20px;font-style:italic;margin-bottom:16px;\""
    const logoStyle = " style=\"height: 24px;margin: 0px 4px;\" "
    const instructionStyle = "style=\"color:"+ instructionColour + ";font-size:16px;\margin-bottom:4px;\""
    const gsTitleStyle = "style=\"color:#434343;font-size:32px;font-weight:700;margin-right:auto;\""
    const gsSocialStyle = "<style>.social-link {height: 32px;margin: 0px 6px;}</style>"
    const hyperlinkStyle = "<style>a{text-decoration: none;color: black;} a:visited{text-decoration: none;color: black;} a:hover{text-decoration: none !important;opacity: 0.7;} </style>"
    const paypalButtonStyle = "<style>.paypal-icon{height:24px;margin-right:4px}.paypal-button{margin-right:24px;border-radius:24px;height:42px;border:1px solid #003084;outline:none;display:flex;align-items:center;padding:2px 16px;color:#003084;font-size:18px;background-color:white;transition:all 0.3s ease-out}.paypal-button:hover{cursor:pointer;border:1px solid #1ba0de}.paypal-button:active{cursor:pointer;border:1px solid #1ba0de;color:white;background-color:#003084}</style>"
    const sponsorButtonStyle = "<style>.btn-github-sponsors {color: #24292e;background-color: #fafbfc;border-color: rgba(27, 31, 35, 0.15) !important;box-shadow: 0 1px 0 rgba(27, 31, 35, 0.04),inset 0 1px 0 hsla(0, 0%, 100%, 0.25);transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);padding: 5px 16px;font-size: 14px;font-weight: 500;line-height: 20px;white-space: nowrap;;cursor: pointer;user-select: none;border: 1px solid;border-radius: 6px;appearance: none;font-family: BlinkMacSystemFont, Segoe UI, Helvetica, Arial; background-color: #f3f4f6;transition-duration: 0.1s;} .icon-github-sponsors {margin-right: 8px;vertical-align: text-bottom;}</style>"
    const gsDescStyle = "style=\"color:"+ gsTextColour+ "\""

    const gsDesc = "This web extension was developed by Grey Software, a not-for-profit open source software development academy where maintainers and students create free software."
    const instruction = "To exit focus mode, click on the LinkedInFocus extension:"
    const gsDonate = "You can support us as we envision and build the software ecosystem of the future by sponsoring us on GitHub and/or by making a donation via PayPal."
    const gsThankYou = "Thank you for your generosity and support 🙂"

    var focusHTML = "<div style=\"padding: 0px 12px;\">"
    focusHTML += "<h1 " + tfTitleStyle + ">Twitter Focus</h1>"
    focusHTML += hyperlinkStyle
    focusHTML += "<p " + quoteStyle + ">" + quote.text + "</p>"
    focusHTML += "<p " + quoteSourceStyle + ">- " + quote.source + "</p>"
    focusHTML += "<p " + instructionStyle + ">" + instruction
    focusHTML += "<img src=\"" + logoUrl + "\" " + logoStyle + ">" + " from the extensions panel on the top right corner of your screen.</p>"
    focusHTML += "<br>"
    

    focusHTML += "<div style=\"border: 2px;border-style:solid;border-color:#434343;padding: 0.96em;height: 263px;margin-top: 16px;padding-top:20px;border-radius:4px;\">"
    focusHTML += "<div style=\"display: flex; align-items: center;margin-bottom:16px;justify-content:space-between\">"

    focusHTML += "<div style=\"display: flex;align-items:center;\">"
    focusHTML += "<img src=\"" + gsLogoUrl + "\" style=\"height: 50px;float:left;margin-right: 6px;\" />"
    focusHTML += "<span><a target=\"_blank\" href=\"https://www.grey.software\"" + gsTitleStyle + ">Grey Software</a></span>"
    focusHTML += "</div>"

    focusHTML += gsSocialStyle
    focusHTML += "<div>"
    focusHTML += "<a target=\"_blank\" href=\"https://www.linkedin.com/company/grey-software/\"><img class=\"social-link\" src=\"" + linkedinLogoUrl + "\" /></a>"
    focusHTML += "<a target=\"_blank\" href=\"https://github.com/grey-software\"><img class=\"social-link\" src=\"" + githubLogoUrl + "\" /></a>"
    focusHTML += "</div>"
    focusHTML += "</div>"

    focusHTML += "<div "+ gsDescStyle+ ">" + gsDesc + "</div>"
    focusHTML += "<div style=\"margin: 12px 0px;color:"+ gsTextColour+"\">" + gsDonate + "</div>"
    focusHTML += "<div style=\"margin-bottom: 12px;color:"+ gsTextColour+"\">" + gsThankYou + "</div>"
    focusHTML += paypalButtonStyle
    focusHTML += sponsorButtonStyle
    focusHTML += "<div style=\"display:flex;align-items:center\">"
    focusHTML += "<a target=\"_blank\" href=\"https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VEAGAZP7DHJNE&source=url\"><button class=\"paypal-button\"><img class=\"paypal-icon\" src=\"" + paypalLogoUrl + "\"/>Donate</button></a>"
    focusHTML += "<a target=\"_blank\" href=\"https://github.com/sponsors/grey-software\" class=\"btn-github-sponsors\"><svg class=\"icon-github-sponsors\" viewBox=\"0 0 16 16\" version=\"1.1\" width=\"16\" height=\"16\" aria-hidden=\"true\"><path fill-rule=\"evenodd\" fill=\"#ea4aaa\" d=\"M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5zM8 14.25l-.345.666-.002-.001-.006-.003-.018-.01a7.643 7.643 0 01-.31-.17 22.075 22.075 0 01-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.08 22.08 0 01-3.744 2.584l-.018.01-.006.003h-.002L8 14.25zm0 0l.345.666a.752.752 0 01-.69 0L8 14.25z\"></path></svg><span>Sponsor</span></a>"
    focusHTML += "</div>"
    focusHTML += "</div>"


    const quoteHtmlNode = document.createElement("div")

    const parser = new DOMParser()
    const parsed = parser.parseFromString(focusHTML, `text/html`)
    const tags = parsed.getElementsByTagName(`body`)

    quoteHtmlNode.innerHTML = ``
    for (const tag of tags) {
        quoteHtmlNode.appendChild(tag)
    }


    document.querySelectorAll(FEED_CONTAINER_CLASS_NAME)[0].prepend(quoteHtmlNode)
    document.querySelectorAll(FEED_CONTAINER_CLASS_NAME)[0].style.fontFamily = "Arial, Helvetica";
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