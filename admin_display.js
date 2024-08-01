function logout() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "models/Session.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("action=logout");

    window.location.href = "index.php"; //redirect back to index page
}

function updateTables() {
    var xhttp = new XMLHttpRequest();
    var usersTable = document.getElementsByClassName("users-table")[0];
    var tabs = document.getElementsByClassName("tabs")[0];

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            try {
                var response = JSON.parse(this.responseText);
                var users = response["users"];
                var scores = response["scores"];

                console.log(scores);
                
                for (let i = 0; i < users.length; i++) {
                    var tr = document.createElement("tr");
                    var nickname = document.createElement("td");
                    var emailAddress = document.createElement("td");
                    var password = document.createElement("td");
                    var country = document.createElement("td");
                    var role = document.createElement("td");
                    var deleteBtn = document.createElement("button");

                    nickname.innerHTML = users[i]["nickname"];
                    emailAddress.innerHTML = users[i]["emailaddress"];
                    password.innerHTML = users[i]["password"];
                    country.innerHTML = users[i]["country"];
                    role.innerHTML = users[i]["role"];
                    deleteBtn.innerHTML = "Delete";
                    deleteBtn.setAttribute("onclick", "removeUser('" + users[i]["emailaddress"] + "')");

                    tr.appendChild(nickname);
                    tr.appendChild(emailAddress);
                    tr.appendChild(password);
                    tr.appendChild(country);
                    tr.appendChild(role);
                    tr.appendChild(deleteBtn);

                    usersTable.appendChild(tr);
                }

                for (let i = 0; i < scores.length; i++) {
                    var div = document.createElement("div");
                    div.className = "tab-content";
                    var scoresTable = document.createElement("table");
                    scoresTable.className = "scores-table";
                    scoresTable.innerHTML = `
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nickname</th>
                            <th>Email Address</th>
                            <th>Country</th>
                            <th>Correct Word</th>
                            <th>Number of Attempts</th>
                        </tr>
                    </thead>
                    `

                    for (let j = 0; j < scores[i].length; j++) {
                        var tr = document.createElement("tr");
                        var scoreID = document.createElement("td");
                        var nickname = document.createElement("td");
                        var emailAddress = document.createElement("td");
                        var country = document.createElement("td");
                        var correctWord = document.createElement("td");
                        var numAttempts = document.createElement("td");

                        scoreID.innerHTML = scores[i][j]["scoreid"];
                        nickname.innerHTML = scores[i][j]["nickname"];
                        emailAddress.innerHTML = scores[i][j]["emailaddress"];
                        country.innerHTML = scores[i][j]["country"];
                        correctWord.innerHTML = scores[i][j]["correctword"];
                        numAttempts.innerHTML = scores[i][j]["numattempts"];

                        tr.appendChild(scoreID);
                        tr.appendChild(nickname);
                        tr.appendChild(emailAddress);
                        tr.appendChild(country);
                        tr.appendChild(correctWord);
                        tr.appendChild(numAttempts);

                        scoresTable.appendChild(tr);
                        div.appendChild(scoresTable);
                    }

                    tabs.appendChild(div);
                }
            }
            catch (error) {
                console.log("Error during update:", error);
            }
        }
    }
    xhttp.open("POST", "models/Admin.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("action=update");
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

                updateTables();
                
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

window.onload = updateTables();