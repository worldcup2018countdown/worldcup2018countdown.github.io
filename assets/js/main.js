

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
                const currentIndex = carouselEl.dataset.ssIndex;
                let newIndex;
                if(btn.classList.contains("next")){
                    newIndex = currentIndex+1;
                }else if(btn.classList.contains("previous")){
                    newIndex = currentIndex-1;
                }
                newIndex = Math.abs(newIndex % this.data.length);
                insertItemStrings(this.data[newIndex], carouselEl, this.carouselId);
                carouselEl.dataset.ssIndex = newIndex;
                console.log("carousel-paginator btn clicked");
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