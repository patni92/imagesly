var commentButton = document.getElementById("comment-button");
if (commentButton) {
    commentButton.addEventListener("click", function() {
        var element = document.getElementById("comment-form");

        if (element.style.display == "block")
            element.style.display = "none";
        else
            element.style.display = "block";
    });
}
