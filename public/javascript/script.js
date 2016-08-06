var webEvents = {
    toogleComment: function() {
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
    },
    postComment: function() {
        $('#comment-form').submit(function(event) {


            var formData = {
                "title": $('input[name=title]').val(),
                "comment": $('textarea[name=comment]').val()
            };

            var url = window.location.pathname + "/comment"

            $.ajax({
                    type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
                    url: url, // the url where we want to POST
                    data: formData, // our data object
                    dataType: 'json', // what type of data do we expect back from the server
                    encode: true
                })
                // using the done promise callback
                .done(function(data) {


                    // log data to the console so we can see

                    var htmlContent = '<li class="media"><div class="media-left"><img class="media-object" src="..." alt="...">';
                    htmlContent += '</div> <div class="media-body">';
                    htmlContent += '<p>' + data + '</p></div></li>';

                    document.querySelector(".comment-list").innerHTML += htmlContent;







                    // here we will handle errors and validation messages
                }).fail(function(jqXHR) {
                    console.log(jqXHR.responseText);
                });

            // stop the form from submitting the normal way and refreshing the page
            event.preventDefault();
        });
    }
};

webEvents.toogleComment();
webEvents.postComment();
