var toggleAddUser = false; //tracks whether a new user is being added
var form = document.getElementById("add-user");

//form to add a new user
form.addEventListener("submit", function(event) {
    event.preventDefault(); //prevent default form submission

    var form = event.target;
    var formData = new FormData(form); //return a key-value pair list with all of the form data
    var dialog = document.getElementsByClassName("dialog")[0];
    var message = document.getElementsByClassName("message")[0];

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            try {
                var response = JSON.parse(this.responseText);
                
                //display error messages whether it is due to incorrect email or password
                if (response["email-error"]) {
                    dialog.classList.add("fade");
                    message.innerHTML = "Email address already exists.";
                    //once the animation ends, remove the class so that the animation can play again on the next iteration
                    setTimeout(function() {
                        dialog.classList.remove("fade");
                    }, 2500);
                }

                else if (response["password-error"]) {
                    dialog.classList.add("fade");
                    message.innerHTML = "Password must be between 8 and 20 characters.";
                    //once the animation ends, remove the class so that the animation can play again on the next iteration
                    setTimeout(function() {
                        dialog.classList.remove("fade");
                    }, 2500);
                }

                if (response["redirect"]) { //signup successful
                    dialog.classList.add("fade");
                    message.innerHTML = "User added successfully.";
                    //once the animation ends, remove the class so that the animation can play again on the next iteration
                    setTimeout(function() {
                        dialog.classList.remove("fade");
                    }, 2500);

                    updateTables();
                }
                
            }
            catch (error) {
                console.log("Error during login:", error);
            }
        }
    }
    xhttp.open("POST", "models/SignUp.php", true);
    xhttp.send(formData);

    return true;
});

function logout() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "models/Session.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("action=logout");

    window.location.href = "index.php"; //redirect back to index page
}

function showTabContent(index) {
    var tab = document.getElementsByClassName("tab");
    var tabContent = document.getElementsByClassName("tab-content");

    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
        tab[i].classList.remove("active");
    }
    
    tab[index].classList.add("active");
    tabContent[index].style.display = "block";
}

function updateTables() {
    var xhttp = new XMLHttpRequest();
    var usersTable = document.getElementsByClassName("users-table")[0];
    var usersTableBody = document.getElementsByClassName("users")[0];
    var tabs = document.getElementsByClassName("tabs")[0];
    var tab = document.getElementsByClassName("tab");
    var tabContent = document.getElementsByClassName("tab-content");
    var tabContents = [];

    while (tabs.hasChildNodes()) {
        tabs.removeChild(tabs.firstChild);
    }

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            try {
                var response = JSON.parse(this.responseText);
                var users = response["users"];
                var scores = response["scores"];

                keys = Object.keys(scores);

                for (let i = 0; i < keys.length; i++) {
                    let tab = document.createElement("button");
                    tab.className = "tab";
                    tab.setAttribute("onclick", "showTabContent(" + i + ")");
                    tab.innerHTML = keys[i];
                    tabs.appendChild(tab);

                    let div = document.createElement("div");
                    div.className = "tab-content";
                    let scoresTable = document.createElement("table");
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

                    for (let j = 0; j < scores[keys[i]].length; j++) {
                        let tr = document.createElement("tr");
                        let scoreID = document.createElement("td");
                        let nickname = document.createElement("td");
                        let emailAddress = document.createElement("td");
                        let country = document.createElement("td");
                        let correctWord = document.createElement("td");
                        let numAttempts = document.createElement("td");

                        scoreID.innerHTML = scores[keys[i]][j]["scoreid"];
                        nickname.innerHTML = scores[keys[i]][j]["nickname"];
                        emailAddress.innerHTML = scores[keys[i]][j]["emailaddress"];
                        country.innerHTML = scores[keys[i]][j]["country"];
                        correctWord.innerHTML = scores[keys[i]][j]["correctword"];
                        numAttempts.innerHTML = scores[keys[i]][j]["numattempts"];

                        tr.appendChild(scoreID);
                        tr.appendChild(nickname);
                        tr.appendChild(emailAddress);
                        tr.appendChild(country);
                        tr.appendChild(correctWord);
                        tr.appendChild(numAttempts);

                        scoresTable.appendChild(tr);
                        div.appendChild(scoresTable);
                    }
                    tabContents.push(div);
                }

                for (let i = 0; i < tabContents.length; i++) {
                    tabs.appendChild(tabContents[i]);
                }

                if (tab.length > 0) {
                    tab[0].classList.add("active");
                    tabContent[0].style.display = "block";
                }

                var tbody = document.createElement("tbody");
                tbody.className = "users";
                
                for (let i = 0; i < users.length; i++) {
                    let tr = document.createElement("tr");
                    let nickname = document.createElement("td");
                    let emailAddress = document.createElement("td");
                    let password = document.createElement("td");
                    let country = document.createElement("td");
                    let role = document.createElement("td");
                    let deleteBtn = document.createElement("button");

                    nickname.innerHTML = users[i]["nickname"];
                    emailAddress.innerHTML = users[i]["emailaddress"];
                    password.innerHTML = users[i]["password"];
                    country.innerHTML = users[i]["country"];
                    role.innerHTML = users[i]["role"];
                    deleteBtn.innerHTML = "Delete";
                    deleteBtn.className = "button";
                    deleteBtn.setAttribute("type", "button");
                    deleteBtn.setAttribute("onclick", "removeUser('" + users[i]["emailaddress"] + "')");

                    tr.appendChild(nickname);
                    tr.appendChild(emailAddress);
                    tr.appendChild(password);
                    tr.appendChild(country);
                    tr.appendChild(role);
                    tr.appendChild(deleteBtn);

                    tbody.appendChild(tr);
                }
                usersTable.replaceChild(tbody, usersTableBody);
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

function addUser() {
    var usersTableBody = document.getElementsByClassName("users")[0];
    
    if (toggleAddUser) {
        toggleAddUser = false;
        usersTableBody.removeChild(usersTableBody.lastChild);
        return;
    }

    toggleAddUser = true;

    var usersTableBody = document.getElementsByClassName("users")[0];

    var tr = document.createElement("tr");
    var nickname = document.createElement("td");
    var emailAddress = document.createElement("td");
    var password = document.createElement("td");
    var country = document.createElement("td");
    var role = document.createElement("td");
    var saveBtn = document.createElement("button");

    nickname.innerHTML = '<input type="text" id="nickname" name="nickname" autocomplete="given-name" required class="text-input">';
    emailAddress.innerHTML = '<input type="email" id="email-address" name="email-address" autocomplete="username" required class="text-input">';
    password.innerHTML = '<input type="password" id="password" name="password" required class="text-input">';
    country.innerHTML = `
    <select id="country" name="country" class="select-input" required>
        <option value="United States">United States</option>
        <option value="Afghanistan">Afghanistan</option>
        <option value="Albania">Albania</option>
        <option value="Algeria">Algeria</option>
        <option value="American Samoa">American Samoa</option>
        <option value="Andorra">Andorra</option>
        <option value="Angola">Angola</option>
        <option value="Anguilla">Anguilla</option>
        <option value="Antartica">Antarctica</option>
        <option value="Antigua and Barbuda">Antigua and Barbuda</option>
        <option value="Argentina">Argentina</option>
        <option value="Armenia">Armenia</option>
        <option value="Aruba">Aruba</option>
        <option value="Australia">Australia</option>
        <option value="Austria">Austria</option>
        <option value="Azerbaijan">Azerbaijan</option>
        <option value="Bahamas">Bahamas</option>
        <option value="Bahrain">Bahrain</option>
        <option value="Bangladesh">Bangladesh</option>
        <option value="Barbados">Barbados</option>
        <option value="Belarus">Belarus</option>
        <option value="Belgium">Belgium</option>
        <option value="Belize">Belize</option>
        <option value="Benin">Benin</option>
        <option value="Bermuda">Bermuda</option>
        <option value="Bhutan">Bhutan</option>
        <option value="Bolivia">Bolivia</option>
        <option value="Bosnia and Herzegowina">Bosnia and Herzegowina</option>
        <option value="Botswana">Botswana</option>
        <option value="Bouvet Island">Bouvet Island</option>
        <option value="Brazil">Brazil</option>
        <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
        <option value="Brunei Darussalam">Brunei Darussalam</option>
        <option value="Bulgaria">Bulgaria</option>
        <option value="Burkina Faso">Burkina Faso</option>
        <option value="Burundi">Burundi</option>
        <option value="Cambodia">Cambodia</option>
        <option value="Cameroon">Cameroon</option>
        <option value="Canada">Canada</option>
        <option value="Cape Verde">Cape Verde</option>
        <option value="Cayman Islands">Cayman Islands</option>
        <option value="Central African Republic">Central African Republic</option>
        <option value="Chad">Chad</option>
        <option value="Chile">Chile</option>
        <option value="China">China</option>
        <option value="Christmas Island">Christmas Island</option>
        <option value="Cocos Islands">Cocos (Keeling) Islands</option>
        <option value="Colombia">Colombia</option>
        <option value="Comoros">Comoros</option>
        <option value="Congo">Congo</option>
        <option value="Congo">Congo, the Democratic Republic of the</option>
        <option value="Cook Islands">Cook Islands</option>
        <option value="Costa Rica">Costa Rica</option>
        <option value="Cota D'Ivoire">Cote d'Ivoire</option>
        <option value="Croatia">Croatia (Hrvatska)</option>
        <option value="Cuba">Cuba</option>
        <option value="Cyprus">Cyprus</option>
        <option value="Czech Republic">Czech Republic</option>
        <option value="Denmark">Denmark</option>
        <option value="Djibouti">Djibouti</option>
        <option value="Dominica">Dominica</option>
        <option value="Dominican Republic">Dominican Republic</option>
        <option value="East Timor">East Timor</option>
        <option value="Ecuador">Ecuador</option>
        <option value="Egypt">Egypt</option>
        <option value="El Salvador">El Salvador</option>
        <option value="Equatorial Guinea">Equatorial Guinea</option>
        <option value="Eritrea">Eritrea</option>
        <option value="Estonia">Estonia</option>
        <option value="Ethiopia">Ethiopia</option>
        <option value="Falkland Islands">Falkland Islands (Malvinas)</option>
        <option value="Faroe Islands">Faroe Islands</option>
        <option value="Fiji">Fiji</option>
        <option value="Finland">Finland</option>
        <option value="France">France</option>
        <option value="France Metropolitan">France, Metropolitan</option>
        <option value="French Guiana">French Guiana</option>
        <option value="French Polynesia">French Polynesia</option>
        <option value="French Southern Territories">French Southern Territories</option>
        <option value="Gabon">Gabon</option>
        <option value="Gambia">Gambia</option>
        <option value="Georgia">Georgia</option>
        <option value="Germany">Germany</option>
        <option value="Ghana">Ghana</option>
        <option value="Gibraltar">Gibraltar</option>
        <option value="Greece">Greece</option>
        <option value="Greenland">Greenland</option>
        <option value="Grenada">Grenada</option>
        <option value="Guadeloupe">Guadeloupe</option>
        <option value="Guam">Guam</option>
        <option value="Guatemala">Guatemala</option>
        <option value="Guinea">Guinea</option>
        <option value="Guinea-Bissau">Guinea-Bissau</option>
        <option value="Guyana">Guyana</option>
        <option value="Haiti">Haiti</option>
        <option value="Heard and McDonald Islands">Heard and Mc Donald Islands</option>
        <option value="Holy See">Holy See (Vatican City State)</option>
        <option value="Honduras">Honduras</option>
        <option value="Hong Kong">Hong Kong</option>
        <option value="Hungary">Hungary</option>
        <option value="Iceland">Iceland</option>
        <option value="India">India</option>
        <option value="Indonesia">Indonesia</option>
        <option value="Iran">Iran (Islamic Republic of)</option>
        <option value="Iraq">Iraq</option>
        <option value="Ireland">Ireland</option>
        <option value="Israel">Israel</option>
        <option value="Italy">Italy</option>
        <option value="Jamaica">Jamaica</option>
        <option value="Japan">Japan</option>
        <option value="Jordan">Jordan</option>
        <option value="Kazakhstan">Kazakhstan</option>
        <option value="Kenya">Kenya</option>
        <option value="Kiribati">Kiribati</option>
        <option value="Democratic People's Republic of Korea">Korea, Democratic People's Republic of</option>
        <option value="Korea">Korea, Republic of</option>
        <option value="Kuwait">Kuwait</option>
        <option value="Kyrgyzstan">Kyrgyzstan</option>
        <option value="Lao">Lao People's Democratic Republic</option>
        <option value="Latvia">Latvia</option>
        <option value="Lebanon">Lebanon</option>
        <option value="Lesotho">Lesotho</option>
        <option value="Liberia">Liberia</option>
        <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
        <option value="Liechtenstein">Liechtenstein</option>
        <option value="Lithuania">Lithuania</option>
        <option value="Luxembourg">Luxembourg</option>
        <option value="Macau">Macau</option>
        <option value="Macedonia">Macedonia, The Former Yugoslav Republic of</option>
        <option value="Madagascar">Madagascar</option>
        <option value="Malawi">Malawi</option>
        <option value="Malaysia">Malaysia</option>
        <option value="Maldives">Maldives</option>
        <option value="Mali">Mali</option>
        <option value="Malta">Malta</option>
        <option value="Marshall Islands">Marshall Islands</option>
        <option value="Martinique">Martinique</option>
        <option value="Mauritania">Mauritania</option>
        <option value="Mauritius">Mauritius</option>
        <option value="Mayotte">Mayotte</option>
        <option value="Mexico">Mexico</option>
        <option value="Micronesia">Micronesia, Federated States of</option>
        <option value="Moldova">Moldova, Republic of</option>
        <option value="Monaco">Monaco</option>
        <option value="Mongolia">Mongolia</option>
        <option value="Montserrat">Montserrat</option>
        <option value="Morocco">Morocco</option>
        <option value="Mozambique">Mozambique</option>
        <option value="Myanmar">Myanmar</option>
        <option value="Namibia">Namibia</option>
        <option value="Nauru">Nauru</option>
        <option value="Nepal">Nepal</option>
        <option value="Netherlands">Netherlands</option>
        <option value="Netherlands Antilles">Netherlands Antilles</option>
        <option value="New Caledonia">New Caledonia</option>
        <option value="New Zealand">New Zealand</option>
        <option value="Nicaragua">Nicaragua</option>
        <option value="Niger">Niger</option>
        <option value="Nigeria">Nigeria</option>
        <option value="Niue">Niue</option>
        <option value="Norfolk Island">Norfolk Island</option>
        <option value="Northern Mariana Islands">Northern Mariana Islands</option>
        <option value="Norway">Norway</option>
        <option value="Oman">Oman</option>
        <option value="Pakistan">Pakistan</option>
        <option value="Palau">Palau</option>
        <option value="Panama">Panama</option>
        <option value="Papua New Guinea">Papua New Guinea</option>
        <option value="Paraguay">Paraguay</option>
        <option value="Peru">Peru</option>
        <option value="Philippines">Philippines</option>
        <option value="Pitcairn">Pitcairn</option>
        <option value="Poland">Poland</option>
        <option value="Portugal">Portugal</option>
        <option value="Puerto Rico">Puerto Rico</option>
        <option value="Qatar">Qatar</option>
        <option value="Reunion">Reunion</option>
        <option value="Romania">Romania</option>
        <option value="Russia">Russian Federation</option>
        <option value="Rwanda">Rwanda</option>
        <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option> 
        <option value="Saint Lucia">Saint LUCIA</option>
        <option value="Saint Vincent">Saint Vincent and the Grenadines</option>
        <option value="Samoa">Samoa</option>
        <option value="San Marino">San Marino</option>
        <option value="Sao Tome and Principe">Sao Tome and Principe</option> 
        <option value="Saudi Arabia">Saudi Arabia</option>
        <option value="Senegal">Senegal</option>
        <option value="Seychelles">Seychelles</option>
        <option value="Sierra">Sierra Leone</option>
        <option value="Singapore">Singapore</option>
        <option value="Slovakia">Slovakia (Slovak Republic)</option>
        <option value="Slovenia">Slovenia</option>
        <option value="Solomon Islands">Solomon Islands</option>
        <option value="Somalia">Somalia</option>
        <option value="South Africa">South Africa</option>
        <option value="South Georgia">South Georgia and the South Sandwich Islands</option>
        <option value="Span">Spain</option>
        <option value="Sri Lanka">Sri Lanka</option>
        <option value="St. Helena">St. Helena</option>
        <option value="St. Pierre and Miguelon">St. Pierre and Miquelon</option>
        <option value="Sudan">Sudan</option>
        <option value="Suriname">Suriname</option>
        <option value="Svalbard">Svalbard and Jan Mayen Islands</option>
        <option value="Swaziland">Swaziland</option>
        <option value="Sweden">Sweden</option>
        <option value="Switzerland">Switzerland</option>
        <option value="Syria">Syrian Arab Republic</option>
        <option value="Taiwan">Taiwan, Province of China</option>
        <option value="Tajikistan">Tajikistan</option>
        <option value="Tanzania">Tanzania, United Republic of</option>
        <option value="Thailand">Thailand</option>
        <option value="Togo">Togo</option>
        <option value="Tokelau">Tokelau</option>
        <option value="Tonga">Tonga</option>
        <option value="Trinidad and Tobago">Trinidad and Tobago</option>
        <option value="Tunisia">Tunisia</option>
        <option value="Turkey">Turkey</option>
        <option value="Turkmenistan">Turkmenistan</option>
        <option value="Turks and Caicos">Turks and Caicos Islands</option>
        <option value="Tuvalu">Tuvalu</option>
        <option value="Uganda">Uganda</option>
        <option value="Ukraine">Ukraine</option>
        <option value="United Arab Emirates">United Arab Emirates</option>
        <option value="United Kingdom">United Kingdom</option>
        <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
        <option value="Uruguay">Uruguay</option>
        <option value="Uzbekistan">Uzbekistan</option>
        <option value="Vanuatu">Vanuatu</option>
        <option value="Venezuela">Venezuela</option>
        <option value="Vietnam">Viet Nam</option>
        <option value="Virgin Islands (British)">Virgin Islands (British)</option>
        <option value="Virgin Islands (U.S)">Virgin Islands (U.S.)</option>
        <option value="Wallis and Futana Islands">Wallis and Futuna Islands</option>
        <option value="Western Sahara">Western Sahara</option>
        <option value="Yemen">Yemen</option>
        <option value="Serbia">Serbia</option>
        <option value="Zambia">Zambia</option>
        <option value="Zimbabwe">Zimbabwe</option>
    </select>
    `;
    role.innerHTML = `
    <select id="role" name="role" class="select-input" required>
        <option value="Player">Player</option>
        <option value="Admin">Admin</option>
    </select>
    `;
    saveBtn.innerHTML = "Save";
    saveBtn.className = "button";
    saveBtn.setAttribute("type", "submit");

    tr.appendChild(nickname);
    tr.appendChild(emailAddress);
    tr.appendChild(password);
    tr.appendChild(country);
    tr.appendChild(role);
    tr.appendChild(saveBtn);

    usersTableBody.appendChild(tr);
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