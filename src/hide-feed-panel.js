const panelClassName = "css-1dbjc4n r-1u4rsef r-9cbz99 r-1ylenci r-1phboty r-rs99b7 r-ku1wi2 r-1udh08x"
const feedClassName = "css-1dbjc4n r-1jgb5lz r-1ye8kvj r-13qz1uu"
const port = chrome.runtime.connect({ name: "TwitterFocus" });


port.onMessage.addListener(function (msg) {
    if (msg.status === "focus") {
        blockFeedPanel()
    } else if (msg.status === "un-focus") {
        setContentVisibility(true);
    }
});


function setContentVisibility (makeVisible) {
    if (makeVisible) {
        document.getElementsByClassName(panelClassName)[0].style.visibility = "visible";
        document.getElementsByClassName(feedClassName)[1].style.visibility = "visible";
    } else {
        document.getElementsByClassName(panelClassName)[0].style.visibility = "hidden";
        document.getElementsByClassName(feedClassName)[1].style.visibility = "hidden";
    }
}

var intervalId;

function blockFeedPanel () {
    function tryBlockingFeedPanel () {
        if (!isBlocked()) {
            setContentVisibility(false)
            clearInterval(intervalId)
        }
        return
    }

    if (!hasLoaded()) {
        intervalId = setInterval(tryBlockingFeedPanel, 1000)
    } else {
        setContentVisibility(false)
    }

}

function fillQuote () {
    var quote = quotes[Math.floor(Math.random() * quotes.length)];
    // document.getElementsByClassName()[0].style.visibility = 'visible'

    const quoteStyle = "style=\"color:#293E4A;font-size:24px;\margin-bottom:4px;\""
    const lfTitleStyle = "style=\"color:#0477B5;font-size:32px;font-weight:700;margin-bottom:16px;\""
    const quoteSourceStyle = "style=\"color:#293E4A;font-size:20px;font-style:italic;margin-bottom:16px;\""
    const instructionStyle = "style=\"color:#293E4A;font-size:16px;\margin-bottom:4px;\""
    const instruction = "To exit focus mode, click on the Twitter Focus extension:"

    var linkedInFocusHTML = "<h1 " + lfTitleStyle + ">Twitter Focus</h1>"
    linkedInFocusHTML += "<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css\"></link>"
    linkedInFocusHTML += "<p " + quoteStyle + ">" + quote.text + "</p>"
    linkedInFocusHTML += "<p " + quoteSourceStyle + ">- " + quote.source + "</p>"
    linkedInFocusHTML += "<p " + instructionStyle + ">" + instruction

    const quoteHtmlNode = document.createElement("div")
    quoteHtmlNode.innerHTML = linkedInFocusHTML

    document.getElementsByClassName(feedClassName)[1].prepend(quoteHtmlNode)
    document.getElementsByClassName(feedClassName)[1].style.fontFamily = "Arial, Helvetica";

}
function isBlocked () {
    if (!hasLoaded()) {
        return false
    } else {
        return document.getElementsByClassName(panelClassName)[0].style.visibility == "hidden" && document.getElementsByClassName(feedClassName)[1].style.visibility == "hidden"

    }
}
function hasLoaded(){
    return document.getElementsByClassName("css-1dbjc4n r-my5ep6 r-qklmqi r-1adg3ll");
}





