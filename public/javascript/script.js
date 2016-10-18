(function() {
// navigate to signup form instead of login
var hashVal = window.location.hash.split("#")[1];
if (hashVal == "signup") {
    $("#signupbox").show();
    $("#loginbox").hide();
}

// display file name when picked from file picker
var myInput = document.getElementById("file-input");
$(myInput).change(function() {
    document.querySelector(".file-name").textContent = myInput.value.split("\\").pop();
});


var popularImgBox = document.getElementById("popular-img-box");
var commentBox = document.getElementById("popular-comment-box");

if(popularImgBox && commentBox) {
    commentBox.style.height = popularImgBox.offsetHeight +"px"; 
}


var webEvents = {
    toogleComment: function() {

        var commentButton = document.getElementById("comment-button");

        if (commentButton) {
            commentButton.addEventListener("click", function() {
                var element = document.getElementById("comment-form");
                var hrLine = document.querySelector(".style14");

                if (element.style.display === "block") {

                    element.style.display = "none";
                    hrLine.style.display = "none";
                } else {
                    element.style.display = "block";
                    hrLine.style.display = "block";
                }

            });
        }
    },

    postComment: function() {
        $("#comment-form").submit(function(event) {

            var formData = {
                "title": $("input[name=title]").val(),
                "comment": $("textarea[name=comment]").val()
            };

            var url = window.location.pathname + "/comment";

            $.ajax({
                type: "POST",
                url: url,
                data: formData,
                dataType: "json",
                encode: true
            }).done(function(response) {

                var imgSrc = document.querySelector(".gravatar-img").src
                var htmlContent = '<li class="media comment-group"><div class="media-left">';
                htmlContent += '<a href="#">' + '<span class="username">' + response.username + '</span>' + '<img class="media-object comment-gravatar" src="' + imgSrc + '" alt="...">';
                htmlContent += '</a>' + '</div> <div class="media-body">';
                htmlContent += '<form style="display:inline;" id="delete-form" action="' + response.link + '" method="POST">'
                htmlContent += '<button class="btn btn-danger btn-xs pull-right delete-comment" ><i class="fa fa-times" aria-hidden="true"></i></button></form>'
                htmlContent += '<p class="comment-text">' + response.data + '</p>' + '<small class="text-muted pull-right"> a few seconds ago</small>' + '</div></li>';

                var commentList = document.querySelector(".comment-list");
                htmlContent += commentList.innerHTML;
                commentList.innerHTML = htmlContent;

            }).fail(function(jqXHR) {
                console.log(jqXHR.responseText);
            });

            event.preventDefault();
        });
    },

    updateLikes: function() {

        $("#updateLikes").on("click", function(event) {
            $.post(window.location.pathname + "/like", function(data) {
                $("#like-counter").text(data.likes);
            });
        });
    }
};

webEvents.toogleComment();
webEvents.postComment();
webEvents.updateLikes();
})();
