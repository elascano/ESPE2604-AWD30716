// JavaScript Document

document.querySelector('#registryForm').addEventListener('submit', function (e) {

    e.preventDefault();

    let name = document.getElementsByName('name')[0].value.trim();
    let email = document.getElementsByName('email')[0].value.trim();
    let age = parseInt(document.getElementsByName('age')[0].value);

    if(name.length < 3){
        showMessage("The name must have at least 3 characters.", "warning");
        return;
    }

    if(age < 1 || age > 120 || isNaN(age)){
        showMessage("Enter a valid email.", "warning");
        return;
    }

    showMessage("Sending data, please wait...", "loading");

    let formData = new FormData(this);

    fetch('server.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {

        if(data.status === 'success'){
            showMessage(data.message + " - " + data.details, "success");
            document.querySelector('#registryForm').reset();
        }else{
            showMessage(data.details, "error");
        }

    })
    .catch(error =>{
		
		showMessage("Could not connect to the server.", "error");
        console.error(error);
    });

});

function showMessage(text, type){

    let box = document.getElementById("messageBox");

    if(!box){
        box = document.createElement("div");
        box.id = "messageBox";
        document.body.appendChild(box);
    }

    box.innerText = text;
    box.className = type;
    box.style.display = "block";

    if(type !== "loading"){
        setTimeout(() => {
            box.style.display = "none";
        }, 3500);
    }
}