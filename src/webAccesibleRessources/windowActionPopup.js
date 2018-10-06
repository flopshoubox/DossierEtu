console.log("hello");

let timeStamps = [];
let videoTitle = "";
let videoCurrentTime = 0;
let videoDuration = 0;
let hasSelectedPage = false;
let currentlyPlayingDesc = "";
let currentlyPlayingNumber = 0;
let textTitleHThree;
let fullButtonsList = [
	{	buttonName: "skip_previous",
	 		action: "previousVideo",
	 		title : "Previous video"},

	{	buttonName: "fast_rewind",
	 		action: "previousSong",
	 		title : "Previous song"},
	{	buttonName: "pause",
	 		action: "pause",
	 		title : "Play/pause",
	 		callBack: (button) => {
	 			if (button.firstChild.innerText == "pause") { //If it's playing
					browser.runtime.sendMessage({message: "action" , senderScript: "actionPopUp", action:{ toDo: "pause"}})
					.then(answer => {
						if (answer == true) {
							button.firstChild.innerText = "play_arrow";
						}
					});
				}
	 			else{
					browser.runtime.sendMessage({message: "action" , senderScript: "actionPopUp", action:{ toDo: "play"}})
					.then(answer => {
						if (answer == false) {
							button.firstChild.innerText = "pause";
						}
					});
	 			}}},
	{	buttonName: "fast_forward",
	 		action: "nextSong",
	 		title : "Next song"},
	{	buttonName: "skip_next",
	 		action: "nextVideo",
	 		title : "Next video"}
	];
let noTsButtonsList = [
	{	buttonName: "skip_previous",
	 		action: "previousVideo",
	 		title : "Previous video"},
	{	buttonName: "pause",
	 		action: "pause",
	 		title : "Play/pause",
	 		callBack: (button) => {
	 			if (button.firstChild.innerText == "pause") { //If it's playing
					browser.runtime.sendMessage({message: "action" , senderScript: "actionPopUp", action:{ toDo: "pause"}})
					.then(answer => {
						if (answer == true) {
							button.firstChild.innerText = "play_arrow";
						}
					});
				}
	 			else{
					browser.runtime.sendMessage({message: "action" , senderScript: "actionPopUp", action:{ toDo: "play"}})
					.then(answer => {
						if (answer == false) {
							button.firstChild.innerText = "pause";
						}
					});
	 			}}},
	{	buttonName: "skip_next",
	 		action: "nextVideo",
	 		title : "Next video"}
	]

const onLinkClick = (element) => {
	
}

const onMouseEnterDescription = (element) => {
	console.log("popup - onMouseEnterDescription - launched");
	element.style.color = "blue";
	element.innerText = `${element.innerText} - ${element.dataset.display}`;
}
const onMouseLeaveDescription = (element) => {
	console.log("popup - onMouseLeaveDescription - launched");
	element.style.color = "black";
	element.innerText = element.textContent.replace(` - ${element.dataset.display}`, "");
}

const buttonsCardCreator = (buttonsToCreate) => {
	console.log("popup - buttonsCardCreator - launched");
	let buttonsCardDiv = document.createElement("div");
	buttonsCardDiv.classList.add('card');
	buttonsCardDiv.classList.add('large');
	let buttonsDiv = document.createElement("div");
	buttonsDiv.style[`text-align`] = "center"; 
	buttonsDiv.classList.add("section");
	buttonsDiv.id = "controlButtons";
	for (let i = 0; i < buttonsToCreate.length; i++) {
		let button = document.createElement("button");
		button.classList.add('small');
		button.id = buttonsToCreate[i].buttonName;
		let iTag = document.createElement('i');
		iTag.classList.add('material-icons');
		iTag.innerText = buttonsToCreate[i].buttonName;
		button.appendChild(iTag);
		button.title = buttonsToCreate[i].title;
		button.addEventListener("click", () => {
			browser.runtime.sendMessage({message: "action" , senderScript: "actionPopUp", action:{ toDo: buttonsToCreate[i].action}})
			.then(answer => {
				if (answer == true) {
					if (buttonsToCreate[i].hasOwnProperty('callBack')) {
						buttonsToCreate[i].callBack(button);
					}
				}
			})
		}, true);
		buttonsDiv.appendChild(button);
	}
	let timerPTag = document.createElement('p');
	timerPTag.id = "timer";
	timerPTag.innerText = "00:00";
	timerPTag.style[`text-align`] = "center"; 
	let currentSongPTag = document.createElement('p');
	currentSongPTag.id = "currentSong";
	currentSongPTag.innerText = "";
	currentSongPTag.style[`text-align`] = "center"; 
	buttonsDiv.appendChild(timerPTag);
	buttonsDiv.appendChild(currentSongPTag);
	buttonsCardDiv.appendChild(buttonsDiv);
	document.body.appendChild(buttonsCardDiv);
}

const timerInfosGetter = () => {
	console.log("popup - timerInfosGetter - launched");
	if (hasSelectedPage) {
		browser.runtime.sendMessage({message: "getTimerInfos" , senderScript: "actionPopUp"})
		.then( answer => {
			videoCurrentTime = answer.videoCurrentTime;
			currentlyPlayingDesc = answer.currentlyPlayingDesc;
			currentlyPlayingNumber = answer.currentlyPlayingNumber;
			videoDuration = answer.videoDuration;
			videoIsPaused = answer.videoIsPaused;
		});
	}
}

const timerUpdater = () => {
	console.log("popup - timerUpdater - launched");
	let tsTimer = document.getElementById("timer");
	tsTimer.textContent = `${videoCurrentTime} / ${videoDuration}`;
	if (currentlyPlayingNumber != 0) {
		let currentSongPTag = document.getElementById("currentSong");
		currentSongPTag.innerText = `${currentlyPlayingNumber} - ${currentlyPlayingDesc}`;
		let elementList = document.getElementsByClassName("tsListElement");
		for (let i = 0; i < elementList.length; i++) {
			if (elementList[i].style.color != "blue") {
				elementList[i].style.color = "black";
			}
		}
		document.getElementById(`tsLiNum${currentlyPlayingNumber}`).style.color = 'red';
	}
}

const titleCardCreator = () => {
	console.log("popup - titleCardCreator - launched");
	let titleCardDiv = document.createElement("div");
	titleCardDiv.classList.add('card');
	titleCardDiv.classList.add('large');
	let titleDiv = document.createElement("div");
	titleDiv.classList.add("section");
	let titleHThree = document.createElement("h3");
	titleHThree.id = "title";
	titleHThree.style[`text-align`] = "center";
	textTitleHThree = document.createTextNode(" "); 
	titleHThree.appendChild(textTitleHThree);
	let subtitlePart = document.createElement("h4");
	subtitlePart.id = "subtitle";
	titleDiv.appendChild(titleHThree);
	titleDiv.appendChild(subtitlePart);

	titleCardDiv.appendChild(titleDiv);
	document.body.appendChild(titleCardDiv);
}

const navInfosGetter = async () => {
	console.log("popup - navInfosGetter - launched");
	let answer = await browser.runtime.sendMessage({message: "getNavInfos" , senderScript: "actionPopUp"});
	videoTitle = answer.videoTitle;
}

const titleUpdater = (inputText) => {
	console.log("popup - titleUpdater - launched");
	document.getElementById("title").textContent = inputText;
}

const subTitleUpdater = (inputText) => {
	console.log("popup - subTitleUpdater - launched");
	document.getElementById("subtitle").textContent = inputText;
}

const tsCardCreator = (title) => {
	console.log("popup - tsCardCreator - launched");
	let tsCardDiv = document.createElement("div");
	tsCardDiv.classList.add('card');
	tsCardDiv.classList.add('large');
	let tsDiv = document.createElement("div");
	tsDiv.classList.add("section");
	let tsHThree = document.createElement("h3");
	let textTsHThree = document.createTextNode(title);
	tsHThree.appendChild(textTsHThree);
	tsHThree.style[`text-align`] = "center";
	let tsP = document.createElement("p");
	tsP.id = "timeStamps";
	tsDiv.appendChild(tsHThree);
	tsDiv.appendChild(tsP);
	tsCardDiv.appendChild(tsDiv);
	document.body.appendChild(tsCardDiv);
}

const tsGetter = async () => {
	console.log("popup - tsGetter - launched");
	let answer = await browser.runtime.sendMessage({message: "getTimeStamps" , senderScript: "actionPopUp"})
	timeStamps = answer.timeStamps;
}

const tsUpdater = async () => {
	console.log("popup - tsUpdater - launched");
	console.log(timeStamps);
	let tempOl = document.createElement("ol");
	let i = 0;
	timeStamps.forEach((timeStamp) => {
		i++;
		let tempLi = document.createElement("li");
		let textTempLi = document.createTextNode(`${timeStamp.description}`);
		tempLi.appendChild(textTempLi);
		tempLi.dataset.display = timeStamp.display;
		tempLi.dataset.timeStamp = timeStamp.url.match(/t=\d+/)[0].substring(2);;
		tempLi.id = `tsLiNum${i}`;
		tempLi.classList.add('tsListElement');
		tempLi.addEventListener("mouseenter", () => onMouseEnterDescription(tempLi), true);
		tempLi.addEventListener("mouseleave", () => onMouseLeaveDescription(tempLi), true);
		tempLi.addEventListener("click", () => {
			console.log("popup - onLinkClick - launched");
			browser.runtime.sendMessage({message: "action" , senderScript: "actionPopUp", action:{ toDo: "setCurrentTime", newTime: tempLi.dataset.timeStamp}})
		}, true);
		tempOl.appendChild(tempLi);
	});
	let currentTsp = document.getElementById("timeStamps");
	if (currentTsp.hasChildNodes()) {
		console.log("has childNodes");
		console.log(currentTsp);
		console.log(currentTsp.firstChild);
		console.log(tempOl);
		currentTsp.replaceChild(tempOl,currentTsp.firstChild);
	}
	else{
		console.log("don't has childNodes");
		currentTsp.appendChild(tempOl);
	}
	if (timeStamps.length > 0) {
		let hthree = document.getElementsByTagName("h3")[1];
		hthree.textContent = "Timestamps";
		hthree.style[`text-align`] = "left"; 
	}
}

const footerCreator = async () => {
	let footer = document.createElement("footer");
		footer.classList.add("footer");
	let divContainer = document.createElement("div");
		divContainer.classList.add("container");
	let divContent = document.createElement("div");
		divContent.classList.add("content");
		divContent.classList.add("has-text-centered");
	
	let paragraphOne = document.createElement("p");
	let strongPart = document.createElement("strong");
		strongPart.textContent = "YouTimeStamp";
	paragraphOne.appendChild(strongPart);
	let textOne = document.createTextNode(" by ");
	paragraphOne.appendChild(textOne);
	let linkedInLink = document.createElement("a");
	linkedInLink.href = "https://fr.linkedin.com/in/florent-pergoud-3213a5b9";
	linkedInLink.textContent = "Florent PERGOUD";
	paragraphOne.appendChild(linkedInLink);
	let textTwo = document.createTextNode(". The source code is licensed ");
	paragraphOne.appendChild(textTwo);
	let mitLink = document.createElement("a");
		mitLink.href = "http://opensource.org/licenses/mit-license.php";
		mitLink.textContent = "MIT";
	paragraphOne.appendChild(mitLink);
	let textThree = document.createTextNode(".");
	paragraphOne.appendChild(textThree);
	divContent.appendChild(paragraphOne);

	let paragraphTwo = document.createElement("p");
	let textIssue = document.createTextNode("To report a bug please use ");
	paragraphTwo.appendChild(textIssue);
	let urlIssue = document.createElement("a");
		urlIssue.href = "https://github.com/flopshoubox/YouTimeStamp/issues";
		urlIssue.textContent = "Github issues";
	paragraphTwo.appendChild(urlIssue);
	let textIssueTwo = document.createTextNode(" section of ");
	paragraphTwo.appendChild(textIssueTwo);
	let urlGithub = document.createElement("a");
		urlGithub.href = "https://github.com/flopshoubox/YouTimeStamp";
		urlGithub.textContent = " GitHub page.";
	paragraphTwo.appendChild(urlGithub);
	
	divContent.appendChild(paragraphTwo);
	divContainer.appendChild(divContent);
	footer.appendChild(divContainer);
	document.body.appendChild(footer);

/*
    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>
            <strong>Bulma</strong>
             by 
            <a href="https://jgthms.com">Jeremy Thomas</a>
            . The source code is licensed
            <a href="http://opensource.org/licenses/mit-license.php">MIT</a>
            . The website content is licensed 
            <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>.
          </p>
        </div>
      </div>
  </footer>
*/

}

const windowLoader = async () => {
	console.log("popup - windowLoader - launched");
	compatibilityCheck = await browser.runtime.sendMessage({message: "compatibilityCheck" , senderScript: "actionPopUp"});
	hasSelectedPage = compatibilityCheck.hasSelectedPage;
	console.log(`compatibilityCheck.compatible = ${compatibilityCheck.compatible}`)
	console.log("titleCardCreator");
	titleCardCreator();
	if (hasSelectedPage) {
		console.log("navInfosGetter");
		await navInfosGetter();
		console.log("titleUpdater");
		titleUpdater(videoTitle);
		console.log("buttonsCardCreator");
		if (compatibilityCheck.compatible) {
			buttonsCardCreator(fullButtonsList);
			console.log("tsCardCreator");
			tsCardCreator("Time stamps");
			console.log("tsUpdater");
			await tsGetter();
			await tsUpdater();
		}
		else{
			console.log("subTitleUpdater");
			buttonsCardCreator(noTsButtonsList);
			console.log("tsCardCreator");
			tsCardCreator("No timestamp on this video");
		}
	}
	else{
		console.log("titleUpdater");
		titleUpdater("Please choose a tab to track by clicking on the play button on the right of the URL bar while beeing on a YouTube video page");
		subTitleUpdater("Check below for an example of working description :\n");
		let subtitle = document.getElementById("subtitle");
		let imgDiv = document.createElement("div");
		imgDiv.classList.add("card");
		imgDiv.classList.add('large');
		let imgTag = document.createElement("img");
		imgTag.src = "help.png";
		imgTag.alt = "Help image";
		imgTag.classList.add("section");
		imgTag.classList.add("media");
		imgDiv.appendChild(imgTag);
		subtitle.appendChild(imgDiv);
	}
	footerCreator();
}

windowLoader();
window.setInterval(() => {
	timerInfosGetter();
	timerUpdater();}
	, 100);
window.setInterval(() => {
	document.getElementById("pause").firstChild.innerText = videoIsPaused ? "play_arrow" : "pause" ;
}, 1000);
window.setInterval(() => {
	navInfosGetter()
	.then(() => {
		titleUpdater(videoTitle);
	})
	tsGetter()
	.then(() => {tsUpdater()});
},3000);