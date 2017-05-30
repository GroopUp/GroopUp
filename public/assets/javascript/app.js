// Capture the form inputs 
$("#submit").on("click", function() {
    // // Form validation
    // function validateForm() {
    //     var isValid = true;
    //     $('.chosen-select').each(function() {

    //         if ($(this).val() === "")
    //             isValid = false
    //     })
    //     return isValid;
    // }

    // // If all required fields are filled
    // if (validateForm() == true) {
    //     // Create an object for the user's data
    // var userData = {
    var scores = [
        $("input[name='first-question']:checked").val(),
        $("input[name='second-question']:checked").val(),
        $("input[name='third-question']:checked").val(),
        $("input[name='fourth-question']:checked").val(),
        $("input[name='fifth-question']:checked").val(),
        $("input[name='sixth-question']:checked").val(),
        $("input[name='seventh-question']:checked").val(),
        $("input[name='eighth-question']:checked").val(),
        $("input[name='ninth-question']:checked").val(),
        $("input[name='tenth-question']:checked").val()
    ];
    // }

    // Grab the URL of the website
    var currentURL = window.location.origin;

    // AJAX post the data to the friends API. 
    $.post(currentURL + "/quizdone", {"result":JSON.stringify(scores)}, function(data) {
        console.log(scores);
    });
    // } else {
    //     alert("Please fill out all fields before submitting!");
    // }

    // return false;
});
