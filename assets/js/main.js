

// A group === tournament_facts JSON Array Object
// An item === a single item(object) in the group(array)
// A propery === a key in the item object

function insertGroupStrings(groupArray, groupName){
    const appContainerEl = document.querySelector(".app-container");
    appContainerEl.querySelectorAll("[data-ss-item="+groupName+"]").forEach( (segment, index) => {
        insertItemStrings(groupArray[index], segment, groupName);
        segment.dataset.ssIndex = index;
    });
}
function insertItemStrings(itemData, segment, groupName){
    const strSubPrefix = "str-sub-";
    const groupQueryString = strSubPrefix+groupName;
    const groupDatasetSelector = "[data-"+groupQueryString+"]";
    const groupDatasetProperty = groupQueryString.
            replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    segment.querySelectorAll(groupDatasetSelector).forEach( el => {
        el.textContent = itemData[el.dataset[groupDatasetProperty]];
    })
}
// function instertElAtrribute(itemData, node, elAttribute){
//     // const dataValue = itemData[el.dataset[groupDatasetProperty]];
//     // segment.querySelectorAll(groupDatasetSelector).forEach( el => {
//     //     if(elAttribute == "bgUrl"){
//     //         el.style.backgroundImage = `url("${dataValue}")`;
//     //     }else{
//     //         el.textContent = dataValue;
//     //     }
//     // })
// }

function displayMatchCard(matchData, matchCardNode, ssName){
    insertItemStrings(matchData, matchCardNode, ssName);

    // insert city and stadium links
    function slugify(s){return s.replace(/ /g, "-");}
    matchCardNode.querySelector("a.city").href = `/cities/${slugify(matchData.City)}.html`;
    matchCardNode.querySelector("a.stadium").href = `/stadiums/${slugify(matchData.Stadium)}.html`;

    // insert match report link
    const matchReportLink = matchCardNode.querySelector(".x-vs-y-score-link");
    matchReportLink.href = matchData.FifaUrl;
    // hide match report if the match is in "NS" status
    if(matchData.Status == "NS") matchReportLink.style.display = "none";
}

function fetchJSON (jsonPath){
	return fetch(jsonPath)
	.then( res =>  res.json() )
}

class carouselJSON {
    constructor({jsonUrl = "", carouselId = ""}){
        this.path = jsonUrl;
        this.carouselId = carouselId;
        this.init = this.fetchAndInsert();
    }
    fetchAndInsert(){
        fetchJSON(this.path).then(data => {
            this.data = data;
            insertGroupStrings(data, this.carouselId);
            this.listenForPagination();
        })
    }
    listenForPagination(){
        const carouselEl = document.querySelector("[data-carousel-id="+this.carouselId+"]");
        document.querySelectorAll(".carousel-paginator button").forEach(btn => {
            btn.addEventListener('click', e => {
                const currentIndex = Number(carouselEl.dataset.ssIndex);
                let newIndex;
                if(btn.classList.contains("next")){
                    newIndex = currentIndex+1;
                }else if(btn.classList.contains("previous")){
                    newIndex = currentIndex-1;
                }
                if(newIndex == -1) newIndex = this.data.length-1;
                newIndex = Math.abs(newIndex % this.data.length);
                insertItemStrings(this.data[newIndex], carouselEl, this.carouselId);
                carouselEl.dataset.ssIndex = newIndex;
                // console.log("carousel-paginator btn clicked", newIndex);
            })
        });
    }
}

class WCCountdownApp {
    constructor(){
        this.initUI = this._initUIComponents();
    }

    _initUIComponents(){
        this.listenForCollapsers();
        this.listenForSimpleCarousel();
        this.listenForStadiumHiding();
        this.createShareLinks();
    }

    listenForCollapsers(){
        document.querySelectorAll(".collapse-trigger").forEach(el => {
            el.addEventListener('change', e => {
                const collapserDiv = el.closest(".collapser");
                collapserDiv.classList.toggle("reveal");
            })
        })
    }

    listenForSimpleCarousel(){
        // switch show clases on carousel children
    }

    listenForStadiumHiding(){
        const showStadiumsCheck = document.getElementById("show-stadiums-checkbox");
        if(!showStadiumsCheck) return;
        showStadiumsCheck.addEventListener("change", e => {
            document.querySelector(".match-cards-container").classList.toggle("show-stadiums");
        });
    }

    createShareLinks(){
        const shareContainer = document.querySelector("#toolbar-page-share .share-container");
        if(!shareContainer) return;
        const shareAnchors = shareContainer.querySelectorAll("a");
        shareAnchors.forEach(a => {
            const shareURL = new URL(a.href);
            const shareURLBase = shareURL.origin + shareURL.pathname;
            const shareParams = a.dataset.shareParams.split(",");
            const shareURLProper = new URL(shareURLBase);
            shareParams.forEach(qry => {
                let val;
                if(qry == "url" || qry == "u" || qry == "canonicalUrl"){
                    val = window.location.href;
                }
                if(qry == "title") val = document.title;
                if(qry == "hashtags") val = "worldcup2018countdown,wc2018";
                if(qry == "text") val = "Coundown for the World Cup!";

                // if there is a query value in the anchor data attributes it overrides defaults;
                if(a.dataset[qry]) val = a.dataset[qry];
                shareURLProper.searchParams.set(qry, val);
            });
            a.href = shareURLProper.href;
        });
    }
}
const WCCountdownComponentsController = new WCCountdownApp();




// --------
// SERVICE WORKER LOGIC
//  -------
if(navigator.serviceWorker){
	navigator.serviceWorker.register('/sw.js').then(reg => {
		// console.log('sw ready to go.', reg);
		if(!navigator.serviceWorker.controller){
			if(reg.installing){
				// sw is taking control for the first time
				const sw = reg.installing;
				sw.addEventListener('statechange', event => {
					if (sw.state == "activated") {
						// there is an update ready
						console.log("Site is offline enabled.");
					}
				});
			}
			return;
		}

		let promptedUpdate = false;
		const activateWaitingSW = function(){
			reg.waiting.postMessage({skipWaiting: true});
		}

		if(reg.waiting){
			// there's an udate ready

			// we can decide to always update the sw whenevever waiting
			activateWaitingSW(); return;

			// or we can make it up to the user to update the page version
            // console.log("Please update the page");
			promptedUpdate = true;
		}


		reg.addEventListener('updatefound', function() {
			// reg.installing has changed after a sw has been active on page
			reg.installing.addEventListener('statechange', function() {
				console.log('SW statechange:', this.state);
				if (this.state == 'redundant') return;

				if (this.state == 'installed'){
					// there is an update ready
					// console.log({msg: "sw successfully installed, there is an update ready"});
					if(promptedUpdate) {
						// the user hasn't updated when last propmted and thus
						// there is an even new sw available
                        // console.log("Already prompted user to update");
					}else{
                        console.log("There is a new site version.");
					}
				}
			})
		});



	}).catch( err => {
		console.log('sw registration error:', err);
	});

	navigator.serviceWorker.addEventListener('controllerchange', function(){
		// the service worker controlling this page has change
		// i.e incummbent sw has become redundat and the waiting one has taken over
		// this is a good time to reload the page
		// console.log("About to RELOAAAAD!");
		window.location.reload();
	});
}