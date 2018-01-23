// Get the matches Json and the display them
// Also listen for pagination clicks

const matchDates = {};
fetchJSON("../assets/json/Matches.json").then(matches => {
    const matchDayPaginator = document.getElementById("matchday-paginator");
    matchDayPaginator.style.display = "none";

    console.log(matches[0]);
    // convert matches array to matchDates objects
    matches.forEach(match => {
        // if we don't have match's date as a key, we create an array and
        // put the first item as the match date
        // if the match's date is already a key in the matchDates object then
        // push on the match data to that date
        const stDate = match.stDate;
        if(!matchDates[stDate]) {
            matchDates[stDate] = [];
            matchDates[stDate][0] = match;
        }
        else matchDates[stDate].push(match);
    })
    calcDisplayDate();
    matchDayPaginator.style.display = "flex";
})

const dateHeader = document.getElementById("date-header");
const matchCardContainer = document.querySelector(".match-cards-container");
const restDayWrapper = document.getElementById("rest-day-wrapper");
const matchCardTemplate = document.querySelector(".templates .match-card");

const nextDayBtn = document.getElementById("next-day");
const prevDayBtn = document.getElementById("prev-day");

nextDayBtn.onclick = function(){
    calcDisplayDate(displayedDate, 1);
}
prevDayBtn.onclick = function(){
    calcDisplayDate(displayedDate, -1);
}

// The day to display is
// 1) if were at a day before 14th, then display June 14th
// 2) for each day during the tournament show the current Date
// 3) for days after the tornament show the last-day
let displayedDate;
function calcDisplayDate(date, adder){
    const today = new Date();
    const d = date || today;
    const add = adder || 0;
    let dateToBeDisplayed = new Date(d).getTime();

    const startDateTime = 1528923600000;
    const endDateTime = 1531602000000;

    prevDayBtn.style.opacity = 1;
    nextDayBtn.style.opacity = 1;

    dateToBeDisplayed += (add*24*3600*1000);

    if(dateToBeDisplayed <= startDateTime){ 
        dateToBeDisplayed = startDateTime;
        prevDayBtn.style.opacity = 0;
    }
    if(dateToBeDisplayed >= endDateTime){ 
        dateToBeDisplayed = endDateTime;
        nextDayBtn.style.opacity = 0;
    }

    const dateString = new Date(dateToBeDisplayed).toDateString();
    displayedDate = dateString; // Day Month Date Year (Fri Jun 15 2018)
    // dateHeader.textContent = dateString.slice(0,10); // Day Month Date (Fri Jun 15)
    const dateKey = dateString.slice(4); // Month Date Year (Jun 15 2018)
    displayDateContents(dateKey);
}

function displayDateContents (dateKey){
    restDayWrapper.classList.add("hide");
    // Remove all the child nodes in the match card container
    while (matchCardContainer.firstChild) {
        matchCardContainer.removeChild(matchCardContainer.firstChild);
    }
    if (!matchDates[dateKey]) {restDayWrapper.classList.remove("hide"); return;}
    dateHeader.textContent = matchDates[dateKey][0].OrdinalShortDate;
    matchDates[dateKey].forEach(match => {
        const matchCard = matchCardTemplate.cloneNode(true);
        matchCardContainer.appendChild(matchCard);
        displayMatchCard(match, matchCard, "match-dates-list");
    })
}