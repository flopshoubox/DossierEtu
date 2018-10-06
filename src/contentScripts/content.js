let video = document.getElementsByTagName("video")[0];
let videoTitle;
let tStampURL;
const timeStamps = [];
let timeStampDisplay;
let tSDescription;
let choosenTab = false;
let videoCurrentTime;
let currentlyPlayingDesc = "";
let videoDuration;
let currentlyPlayingNumber = 0;
let pageLoaded = false;
let nextVideoInfos = {} ;
console.log("coucou");

const secondToDHMS = (seconds) => {
	console.log("content - secondToDHMS - launched");
	let tsDay = Math.floor(seconds/86400);
	let tsHour = Math.floor((seconds - (tsDay * 86400)) / 3600);
	let tsMin = Math.floor((seconds - (tsDay * 86400) - (tsHour * 3600)) / 60);
	let tsSec = Math.floor(seconds - (tsDay * 86400) - (tsHour * 3600) - (tsMin * 60));

	let timeStampDisplay = "";
	if (tsDay > 0) {
		if (tsDay < 10) {
			timeStampDisplay += "0";
		}
		timeStampDisplay += `${tsDay}:`;
		if (tsDay == 0) {
			timeStampDisplay += "00";
		}
	}
	if (tsHour > 0) {
		if (tsHour < 10) {
			timeStampDisplay += "0";
		}
		timeStampDisplay += `${tsHour}:`;
	}

	if (tsMin < 10) {
		timeStampDisplay += "0";
	}
	timeStampDisplay += `${tsMin}:`;

	if (tsSec < 10) {
		timeStampDisplay += "0";
	}
	timeStampDisplay += `${tsSec}`;
	return timeStampDisplay;
}

const tsInfosUpdater = async () => {
	console.log("content - tsInfosUpdater - launched");
	try{
		while(!(document.getElementsByTagName("yt-formatted-string").hasOwnProperty('description'))){
			while(!(document.getElementsByTagName("yt-formatted-string").description.hasOwnProperty('innerHTML'))){
				while(document.getElementsByTagName("yt-formatted-string").description.innerHTML.length == 0){
				}
			}
		}
		let descriptionHTML = document.getElementsByTagName("yt-formatted-string").description.innerHTML;
		console.log(`descriptionHTML : ${descriptionHTML.split("\n")}`);
		timeStamps.length = 0;
		if (descriptionHTML) {
			console.log(`Has descriptionHTML`);
			descriptionHTML.split("\n").forEach(line => {
				if (line.includes(`href="/${location.href.substring("https://www.youtube.com/".length, location.href.length)}&amp;t=`)){
					tStampURL = `${line.match(/\/watch\?v=[A-Za-z0-9-_]+&amp;t=\d+s/)[0]}`;
					tSSeconds = tStampURL.match(/t=\d+/)[0].substring(2);
					tSDisplay = secondToDHMS(tSSeconds);
					tSDescription = line.replace(/\[*<a.*<\/a>]*/, "").replace(/^[^a-zA-Z]+/,"");
					timeStamps.push({url: tStampURL, seconds: tSSeconds, display: tSDisplay, description: tSDescription});
					console.log(`${timeStamps}`);
				}
			})
		}
		
	}catch(e){console.log(e)}
	console.log("timeStamps updated :");
	console.log(timeStamps);
}

const updateTimerInfos = async () => {
	console.log("content - updateTimerInfos - launched");
	videoCurrentTime = secondToDHMS(video.currentTime);
	videoDuration = await secondToDHMS(video.duration);
	let compatibility = false;
	currentlyPlayingNumber = 0;
	currentlyPlayingDesc = "";
	for (let i = 0; i < timeStamps.length; i++) {	
		currentlyPlayingNumber = i;
		if (video.currentTime  < timeStamps[i].seconds) {
			break;
		}
		currentlyPlayingNumber ++;
		currentlyPlayingDesc = timeStamps[i].description;

	}

}

const updateNextVideoInfos = async () => {
	let nextVideo = document.getElementsByClassName("ytp-next-button")[0];
	nextVideoInfos.title = nextVideo.attributes[5].nodeValue;
	nextVideoInfos.url = nextVideo.href;
	nextVideoInfos.preview = nextVideo.attributes[4].nodeValue;
	console.log(nextVideoInfos);
}

const handleMessage = (request, sender, sendResponse) => {

	switch (request.message){
		case `choosingYou`:
			console.log("content-Message received : choosingYou");
			choosenTab = true;
		break;
		case `noMoreYou`:
			console.log("content-Message received : noMoreYou");
			choosenTab = false;
		break;
		case `action`:
			switch(request.action.toDo){
				case `setCurrentTime`:
					console.log("content-Message received : setCurrentTime");
					video.currentTime = request.action.newTime;
					video.play();
				break;
				case `play`:
					video.play();
					sendResponse((video.paused));
				break;
				case `pause`:
					video.pause();
					sendResponse(video.paused);
				break;
				case `previousSong` :
					video.currentTime = timeStamps[currentlyPlayingNumber-2].seconds;
				break;
				case `nextSong` :
					video.currentTime = timeStamps[currentlyPlayingNumber].seconds;
				break;
				case `previousVideo` :
					window.history.back();
				break;
				case `nextVideo` :
					updateNextVideoInfos();
					location.replace(nextVideoInfos.url);
				break;
			}
		break;	
		case `getTimeStamps`:
			console.log("content-Message received : getTimeStamps");
			tsInfosUpdater()
			.then(sendResponse({timeStamps: timeStamps}));
		break;
		case `getTimerInfos`:
			console.log("content-Message received : getTimerInfos");
			updateTimerInfos()
			.then(sendResponse(
				{
					videoCurrentTime: videoCurrentTime,
					videoDuration: videoDuration,
					currentlyPlayingNumber: currentlyPlayingNumber,
					currentlyPlayingDesc: currentlyPlayingDesc,
					videoIsPaused: video.paused
				}
			));
		break;
		case `getNavInfos`:
			console.log("content-Message received : getNavInfos");
			videoTitle = document.getElementsByTagName("H1")[0].textContent;
			sendResponse({videoTitle: videoTitle});
		break;
	}
}
browser.runtime.onMessage.addListener(handleMessage);