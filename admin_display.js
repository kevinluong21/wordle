function logout() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "models/Session.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("action=logout");

    window.location.href = "index.php"; //redirect back to index page
}