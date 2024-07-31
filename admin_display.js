function logout() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "models/Session.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("action=logout");

    window.location.href = "index.php"; //redirect back to index page
}

function modifyUser() {

}

function removeUser(emailAddress) {
    var xhttp = new XMLHttpRequest();
    var dialog = document.getElementsByClassName("dialog")[0];
    var message = document.getElementsByClassName("message")[0];

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            try {
                var response = JSON.parse(this.responseText);
                var error = response["remove-error"];

                if (error) { //server error
                    throw "Unable to delete user from table";
                }
                
                dialog.classList.add("fade");
                message.innerHTML = "User deleted successfully.";
                //once the animation ends, remove the class so that the animation can play again on the next iteration
                setTimeout(function() {
                    dialog.classList.remove("fade");
                }, 2500);
            }
            catch (error) {
                console.log("Error during deletion:", error);
            }
        }
    }
    xhttp.open("POST", "models/Admin.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("action=removeUser&emailAddress=" + String(emailAddress));
}