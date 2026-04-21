import config from "./utils/config.json" with { type: "json" };


var loginStatus = false;
var user = {name: "", email: "", password: ""};

const login = document.getElementById("login");
const API_URL = config.API_URL;
const API_KEY = config.API_KEY;

login.addEventListener("submit", function(event) {
    event.preventDefault();

    user.name = document.getElementById("name").value;
    user.email = document.getElementById("email").value;
    user.password = document.getElementById("password").value;

    loginStatus = getUser(user);

    if(loginStatus){
        window.location.href = "./src/pages/mainMenu.html";
    } else {
        alert("Invalid email or password. Please try again.");
    }

});

async function getUser(user){
    try {
       const response = await fetch(`${API_URL}?email=eq.${user.email}&password=eq.${user.password}`, {
            method: "GET",
            headers: {
                "apikey": API_KEY,
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
        }});

        if(!response.ok){
            throw new Error("Error fetching user data");
        }

        const data = await response.json();
        
        if(data.length > 0){
            return data[0];
        } else {
            return null;
        }    

    } catch (error) {
        console.error("Error:", error);
        return null;
    }        
}

