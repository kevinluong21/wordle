var login = document.getElementById("login");

login.addEventListener("submit", function(event) {
    event.preventDefault(); //prevent default form submission

    var form = event.target;
    var formData = new FormData(form); //return a key-value pair list with all of the form data

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            try {
                console.log(this.responseText);
                var response = JSON.parse(this.responseText);

                var errorMessages = document.getElementsByClassName("error-message");
                
                //reset the error messages
                for (let i = 0; i < errorMessages.length; i++) {
                    errorMessages[i].innerHTML = "Error message";
                    errorMessages[i].style.visibility = "hidden";
                }
                
                //display error messages whether it is due to incorrect email or password
                if (response["email-error"]) {
                    errorMessages[0].innerHTML = "Email address does not exist";
                    errorMessages[0].style.visibility = "visible";
                }

                else if (response["password-error"]) {
                    errorMessages[1].innerHTML = "Password is incorrect";
                    errorMessages[1].style.visibility = "visible";
                }

                if (response["redirect"]) {
                    window.location.href = response["redirect"]; //redirect to page on successful login
                }
                
            }
            catch (error) {
                console.log("Error during login:", error);
            }
        }
    }
    xhttp.open("POST", "models/Login.php", true);
    xhttp.send(formData);

    return true;
});

// When user clicks on button, show message
function show(message) {
    document.getElementById(message).style.display = 'block'
}

// When user clicks on button, hide mssage
function hide(message) {
    document.getElementById(message).style.display = 'none'
}