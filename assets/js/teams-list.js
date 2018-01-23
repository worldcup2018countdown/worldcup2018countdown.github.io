let countryList;
const fancyBtnListEl = document.querySelector(".fancy-buttons-list");
const orderCountrySelect = document.querySelector("#order-countries");
const ascOrDesc = document.querySelector("#asc-or-desc");
let ascendingOrder = true;

fetchJSON("./assets/json/Team Order List.json").then(data => countryList = data );

orderCountrySelect.addEventListener("change", function(e){
    let category = e.target.value;
    // if we're ordering by group just use the index of the countries
    // since the country list json is already by default ordered by group
    if(category == "Group") category = "initialIndex";
    sortFancyButtons(category, ascendingOrder);
});

function sortFancyButtons(category, ascendingOrder){
    countryList.sort( (a,b) => {
       if(ascendingOrder) return (a[category] > b[category]) ? 1 : ((b[category] > a[category]) ? -1 : 0);
       return (a[category] < b[category]) ? 1 : ((b[category] < a[category]) ? -1 : 0);
    });
    // console.log(countryList[0]);
    countryList.forEach( country => {
        const fancyBtnEl = fancyBtnListEl.querySelector("[data-ss-index='"+country.initialIndex+"']");
        fancyBtnListEl.insertBefore(fancyBtnEl, null);
    });
    fancyBtnListEl.dataset.orderCategory = orderCountrySelect.value.toLowerCase();
}

document.getElementById("asc").addEventListener("click", e => {
	ascendingOrder = true;
	ascOrDesc.className = "asc";
	sortFancyButtons(orderCountrySelect.value, ascendingOrder);
})

document.getElementById("desc").addEventListener("click", e => {
	ascendingOrder = false;
	ascOrDesc.className = "desc";
	sortFancyButtons(orderCountrySelect.value, ascendingOrder);
})

document.querySelector("input#hide-country-meta").addEventListener("change", e => {
    document.querySelector(".fancy-buttons-list").classList.toggle("show-meta");
})