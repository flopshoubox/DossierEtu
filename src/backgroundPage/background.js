console.log("back-background");

let timeStamps,
	activeYoutubeTabID,
	videoTitle,
	videoCurrentTime,
	currentlyPlayingDesc,
	videoDuration,
	compatiblePage,
	hasSelectedPage,
	currentlyPlayingNumber;



const initVar = () => {
	console.log("back-initVar - launched");
	timeStamps = [],
	activeYoutubeTabID = -1,
	videoTitle = "",
	videoCurrentTime = 0,
	currentlyPlayingDesc = "",
	videoDuration = 0,
	compatiblePage = false,
	hasSelectedPage = false;
	currentlyPlayingNumber = 0;
}
initVar();
const handleUpdated = (tabId, changeInfo, tabInfo) => {
	console.log("back-handleUpdated - launched");
	if (changeInfo.url) {
		if (tabInfo.url.match(/https:\/\/www\.youtube\.com\/watch\?v=/)) {
			setTimeout(() => {
				browser.pageAction.show(tabId);
				if (activeYoutubeTabID == tabId) {
					browser.pageAction.setIcon({tabId: tabId, path: "../pageAction/playSelected.png"});
					hasTimeStampsCheck()
				}
			}, 3000);
		}
		else{
			browser.pageAction.hide(tabId);
			if (activeYoutubeTabID == tabId){
				initVar();
				browser.browserAction.setBadgeText({text: ''});
			}
		}
	}
}

const handlePageActionClick = async (tab) => {
	console.log("back-handlePageActionClick - launched");

	if (activeYoutubeTabID != tab.id) {
		browser.tabs.sendMessage(activeYoutubeTabID,{message: "noMoreYou"});
		browser.pageAction.setIcon({tabId: activeYoutubeTabID, path: "../pageAction/playToSelect.png"});

		browser.tabs.sendMessage(tab.id,{message: "choosingYou"});
		browser.pageAction.setIcon({tabId: tab.id, path: "../pageAction/playSelected.png"});
		activeYoutubeTabID = tab.id;
		hasSelectedPage = true;
		await hasTimeStampsCheck();
	}
	else{
		browser.tabs.sendMessage(tab.id,{message: "noMoreYou"});
		browser.pageAction.setIcon({tabId: tab.id, path: "../pageAction/playToSelect.png"});
		initVar();
		browser.browserAction.setBadgeText({text: ''});
	}
	//changing icon and favicon
}

const hasTimeStampsCheck = async () => {
	console.log("back-hasTimeStampsCheck - launched");
	let answer = await browser.tabs.sendMessage(activeYoutubeTabID, {message: "getTimeStamps"});
	console.log(answer);
	timeStamps = answer.timeStamps;
	if (timeStamps.length > 0) {
		compatiblePage = true;
		browser.browserAction.setBadgeText({text: ":)"});
	}
	else {
		compatiblePage = false;
		browser.browserAction.setBadgeText({text: ''});
	}
}

const handleMessage = (request, sender, sendResponse) => {
	switch (request.senderScript){
		case `content`:
			switch (request.message){
				case `currentTime`:
					videoCurrentTime = request.currentTime;
				break;
				case `currentlyPlaying`:
					currentlyPlayingDesc = request.currentlyPlayingDesc;
					currentlyPlayingNumber = request.currentlyPlayingNumber;
					videoDuration = request.videoDuration;
					videoTitle = request.videoTitle;
				break;
			}
		break;

		case `actionPopUp`:
			switch (request.message){
				case `compatibilityCheck`:
					console.log("back-Message received : compatibilityCheck");
					hasTimeStampsCheck()
					.then(sendResponse({compatible: compatiblePage, hasSelectedPage: hasSelectedPage}));
				break;
				case `getNavInfos`:
					console.log("back-Message received : getNavInfos");
					sendResponse(browser.tabs.sendMessage(activeYoutubeTabID, {message: "getNavInfos"}));
				break;
				case `getTimeStamps`:
					console.log("back-Message received : getTimeStamps");
					browser.tabs.sendMessage(activeYoutubeTabID, {message: "getTimeStamps"})
					.then((answer) => {
						timeStamps = answer.timeStamps;
						if (timeStamps.length > 0) {
							compatiblePage = true;
							browser.browserAction.setBadgeText({text: ":)"});
						}
						else {
							compatiblePage = false;
							browser.browserAction.setBadgeText({text: ""});
						}
					});
					sendResponse({timeStamps: timeStamps});
				break;
				case `getTimerInfos`:
					sendResponse(browser.tabs.sendMessage(activeYoutubeTabID, {message: "getTimerInfos"}));
				break;
				case `action`:
					console.log("back-Message received : action")
					sendResponse(browser.tabs.sendMessage(activeYoutubeTabID,{message: "action", action: request.action}));
				break;
			}
		break;
	}	
}

browser.runtime.onMessage.addListener(handleMessage);
browser.tabs.onUpdated.addListener(handleUpdated);
browser.pageAction.onClicked.addListener(handlePageActionClick);
