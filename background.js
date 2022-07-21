console.log("background Running!");


var num = 0;
chrome.browserAction.onClicked.addListener(buttonClicked)

function buttonClicked(tab){
    let msg = 
    {
        f: num
    }
    chrome.tabs.sendMessage(tab.id, msg);
    num++;
}