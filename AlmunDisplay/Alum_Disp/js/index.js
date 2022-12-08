//Max Casteel
//Riley Marsden
//11/29/2022

//This is the javascript file for the alumni display page. It is used to display the alumni information in a table.
//It also contains the functions to make the Contact Us section work.

//This function is used to make the Contact us section on the index.html page work.
//It is called when the submit button is clicked.  Furthermore, the name, email, and message fields must be filled out.
//It then sends the information to the specified email address.
{/* <script src="https://smtpjs.com/v3/smtp.js"></script> */}
function sendEmail() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;
    var body = "Name: " + name + "From: " + email + "Message: " + message;
    
    email.send({
            SecureToken : "6268cee6-cdd6-488e-bbfa-f07b9661e4b9",
            To: 'GrizAlumniRock@outlook.com',
            From: email,
            Subject: "New Contact Form Submission",
            Body: body
        }).then(
            message => alert(message)
        );
}


//This function is used to randomize the json received from the csv to json converter.
//It is called when the page is loaded.
//The purpose is to randomly display 3 alumni on the page.
//The information displayed is the name, Business name, and the short description.
function randomize() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);
            var rand1 = Math.floor(Math.random() * myObj.length);
            var rand2 = Math.floor(Math.random() * myObj.length);
            var rand3 = Math.floor(Math.random() * myObj.length);
            document.getElementById("name1").innerHTML = myObj[rand1].Name;
            document.getElementById("name2").innerHTML = myObj[rand2].Name;
            document.getElementById("name3").innerHTML = myObj[rand3].Name;
            document.getElementById("business1").innerHTML = myObj[rand1].Business;
            document.getElementById("business2").innerHTML = myObj[rand2].Business;
            document.getElementById("business3").innerHTML = myObj[rand3].Business;
            document.getElementById("description1").innerHTML = myObj[rand1].Description;
            document.getElementById("description2").innerHTML = myObj[rand2].Description;
            document.getElementById("description3").innerHTML = myObj[rand3].Description;
        }
    };

    //This for loop is used to display the information of the 3 alumni.
    var table = document.getElementById("table");
    for (var i = 0; i < random.length; i++) {
        var row = table.insertRow(i + 1);
        var name = row.insertCell(0);
        var business = row.insertCell(1);
        var description = row.insertCell(2);
        name.innerHTML = json[random[i]].Name;
        business.innerHTML = json[random[i]].Business;
        description.innerHTML = json[random[i]].Description;
    }
}

async function randomizeV2() {
    // this is a second attempt at the randomize function
    const response = await fetch('https://raw.githubusercontent.com/Rileyj-m/TESTALUM.io/master/AlmunDisplay/Alum_Disp/json/csvjson.json');
    // now we have the json file and can parse it
    // but the format is not as expected
    const json = await response.text();
    // now lets convert the string into an array
    const jsonConverted = JSON.parse(json);
    console.log(jsonConverted);

    returnarr = [];
   // pull out the json objects in the json array when they dont have keys
    for (var i = 0; i < jsonConverted.length; i++) {
        var jsonstring = JSON.stringify(jsonConverted[i]["Q11"]);
        // check if the string is an email
        if (jsonstring.includes("@")) {
            // add to the return array
            returnarr.push(jsonConverted[i]);
        }
    }
    console.log(returnarr);

    // now that we have the array filtered we can randomize it and display it
    var rand1 = 0
    var rand2 = 0
    var rand3 = 0
    while(true){
        rand1 = Math.floor(Math.random() * returnarr.length);
        rand2 = Math.floor(Math.random() * returnarr.length);
        rand3 = Math.floor(Math.random() * returnarr.length);
        if (rand1 != rand2 && rand2 != rand3 && rand1 != rand3) {
            break;
        }
    }
    document.getElementById("Business1OwnerName").innerHTML = returnarr[rand1]["Q8"];
    document.getElementById("Business1Name").innerHTML = returnarr[rand1]["Q1"];
    document.getElementById("DescBusiness1").innerHTML = returnarr[rand1]["Q2"];
    // the last element we need to change the link
    document.getElementById("business1web").href = returnarr[rand1]["Q3"];

    document.getElementById("Business2OwnerName").innerHTML = returnarr[rand2]["Q8"];
    document.getElementById("Business2Name").innerHTML = returnarr[rand2]["Q1"];
    document.getElementById("DescBusiness2").innerHTML = returnarr[rand2]["Q2"];
    // the last element we need to change the link
    document.getElementById("business2web").href = returnarr[rand2]["Q3"];

    document.getElementById("Business3OwnerName").innerHTML = returnarr[rand3]["Q8"];
    document.getElementById("Business3Name").innerHTML = returnarr[rand3]["Q1"];
    document.getElementById("DescBusiness3").innerHTML = returnarr[rand3]["Q2"];
    // the last element we need to change the link
    document.getElementById("business3web").href = returnarr[rand3]["Q3"];
}


//This function is used to display the information of the alumni from the json file and populate each 
//of the four pages with the information.
//It is called when the page is loaded.
//The information displayed is the name, Business name, and the short description, as well as the link to the website of the alumni from the json file and populate each of the four pages with the information.
function display() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);
            var table = document.getElementById("table");
            for (var i = 0; i < myObj.length; i++) {
                var row = table.insertRow(i + 1);
                var name = row.insertCell(0);
                var business = row.insertCell(1);
                var description = row.insertCell(2);
                name.innerHTML = myObj[i].Name;
                business.innerHTML = myObj[i].Business;
                description.innerHTML = myObj[i].Description;
            }
        }
    };
    xmlhttp.open("GET", "alumni.json", true);
    xmlhttp.send();
}

randomizeV2();