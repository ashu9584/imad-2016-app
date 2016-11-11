var user = "";
function getuser () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                user = this.responseText;
            } else {
               console.log("unable to get username");
            }
        }
    };
    
    request.open('GET', '/check-login', true);
    request.send(null);
}
