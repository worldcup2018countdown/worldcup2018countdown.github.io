
// Shuffling through the cards when the prev and next buttons are clicked
document.querySelectorAll(".next-prev").forEach(area => {
    area.addEventListener("click", e => {
        const scardWrapper = area.closest(".carousel-wrapper");
        const totalScards = scardWrapper
                            .querySelectorAll(".carousel-card").length;
        const scardInView = scardWrapper.querySelector(".show-card");
        if (totalScards == 1) return;
        const scardInViewNum = scardInView.dataset.scardNum;
        let scardNumToShow = scardInViewNum;
        if(area.classList.contains("next")) scardNumToShow++;
        if(area.classList.contains("prev")) scardNumToShow--;

        scardNumToShow = scardNumToShow < 0 ? totalScards-1 : scardNumToShow%totalScards;

        scardQuery = "[data-scard-num='"+scardNumToShow+"']";
        scardInView.classList.remove("show-card");
        scardWrapper.querySelector(scardQuery).classList.add("show-card");
    })
});

// Make sure that transversing with the carousel card content with a keyboard
// Doesn't cause undesired layout
document.querySelectorAll(".carousel-card button").forEach(btn => {
    btn.addEventListener("focus", e => {
        const card = btn.closest(".carousel-card");
        const scWrapper = card.closest(".carousel-wrapper");
        if(!card.classList.contains("show-card")){
            scWrapper.querySelector(".show-card").classList.remove("show-card");
            card.classList.add("show-card");
            card.scrollIntoView();
            scWrapper.scrollLeft = 0;
        }
    })
});
