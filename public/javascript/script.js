// navigate to signup form instead of login
var hashVal = window.location.hash.split("#")[1];
   if(hashVal == 'signup') {
      $('#signupbox').show(); $('#loginbox').hide();
   }

   var myInput = document.getElementById('file-input');

$(myInput).change(function()
{
    console.log('input changed to: ');
    console.log(myInput);
    document.querySelector(".file-name").textContent = myInput.value.split('\\').pop();
});
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

            var url = window.location.pathname + "/comment";

            $.ajax({
                type: 'POST',
                url: url,
                data: formData,
                dataType: 'json',
                encode: true
            }).done(function(data) {

                var imgSrc = document.querySelector(".gravatar-img").src
                var htmlContent = '<li class="media"><div class="media-left"><img class="media-object comment-gravatar" src="' + imgSrc +'" alt="...">';
                htmlContent += '</div> <div class="media-body">';
                htmlContent += '<p>' + data + '</p></div></li>';

                document.querySelector(".comment-list").innerHTML += htmlContent;

            }).fail(function(jqXHR) {
                console.log(jqXHR.responseText);
            });


            event.preventDefault();
        });
    },
    updateLikes: function() {

      $('#updateLikes').on('click', function(event) {
           $.post(window.location.pathname + "/like", function(data) {
            $("#like-counter").text(data.likes);
        });

      });



    }
};

webEvents.toogleComment();
webEvents.postComment();
webEvents.updateLikes();
