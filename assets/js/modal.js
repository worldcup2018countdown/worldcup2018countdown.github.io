// Get the modal
var modal = document.getElementById('modal');

// Get the <span> element that closes the modal
var closeSpan = document.querySelector(".modal-content").querySelectorAll(".close")[0];

// When the user clicks on <span> (x), close the modal
closeSpan.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}