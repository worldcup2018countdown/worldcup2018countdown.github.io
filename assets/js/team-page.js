// findout team name
const countryName = document.querySelector(".country-name-banner").dataset.countryName;
getMatchListAndStartCountdown(countryName);

function getMatchListAndStartCountdown(countryName){
    // fetch the match list
    fetchJSON("/assets/json/Matches.json").then(matches => {
        const countryMatches = [];

        // reduce the matches json to only items containing this match
        // show those matches in the group stage matches area;
        matches.forEach(match => {
            if(match["Team 1"] == countryName || match["Team 2"] == countryName){
                countryMatches.push(match);
            }
        });

        // find out which of the game is 
        // the upcoming one if the country is still to play
        // or the last one if the country has finished playing
        // display in in a match card
        // start the countdownn for when it starts
        let upcomingOrLast = countryMatches[0];
        const now = new Date();
        const lastMatchDate = new Date(countryMatches.slice(-1).DateNum);
        if(lastMatchDate < now){
            // this country's matches have all been played
            upcomingOrLast = countryMatches.slice(-1);
        }else{
            for (let m = 0; m < countryMatches.length; m++) {
                const match = countryMatches[m];
                const matchDate = new Date(match.DateNum);
                if( now < matchDate ) {upcomingOrLast = match; break;}
                
            }
        }
        console.log(countryMatches);
        // console.log(upcomingOrLast);
        startCountdownTo(upcomingOrLast.DateNum);

        const segment = document.querySelector(".next-match-area");
        displayMatchCard(upcomingOrLast, segment, "next-match");
    })

}