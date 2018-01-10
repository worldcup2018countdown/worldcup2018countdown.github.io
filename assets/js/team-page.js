// findout team name
const countryName = "South Korea";

// fetch the country list
fetchJSON("../assets/json/Team Order List.json").then(teams => {
    // get the team's data from the country list
    // display the team's data in fancy button
    let countryFancyBtnData;
    for (let t = 0; t < teams.length; t++) {
        const team = teams[t];
        if(team.Name == countryName) {
            countryFancyBtnData = team;
            break;
        }
    }
    const segment = document.getElementById("country-fancy-data");
    insertItemStrings(countryFancyBtnData, segment, "country-button");

    // make an array with only countries within the same group
    // display them in the group collapse body
    groupTeams = [];
    teams.forEach(team => {
        if(team.Group == countryFancyBtnData.Group) groupTeams.push(team);
    });
    console.log(groupTeams);
    getMatchList(countryName);
})

function getMatchList(countryName){
    // fetch the match list
    fetchJSON("../json/Matches.json").then(matches => {
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
        insertItemStrings(upcomingOrLast, segment, "next-match");

        dispalyTeamSquadAndBase();
    })

}

function dispalyTeamSquadAndBase(){
// fetch the team json

// get the squad data and display it
// get the base location and display it
}