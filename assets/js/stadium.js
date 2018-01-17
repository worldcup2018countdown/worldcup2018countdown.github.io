// A click on the images open the modal
var modalTriggers = document.querySelectorAll(".modal-triggers");

// When the user clicks on the button, open the modal
modalTriggers.forEach(div => {
    div.addEventListener("click", e => {
        document.querySelectorAll(".carousel-card")
            .forEach(card => card.classList.remove("show-card"));
        const wantedScardNum = div.dataset.forScardNum;
        const wantedScardQuery = "[data-scard-num='"+wantedScardNum+"']";
        document.querySelector(".carousel-wrapper")
            .querySelector(wantedScardQuery).classList.add("show-card");
        modal.style.display = "block";
    });
}) 