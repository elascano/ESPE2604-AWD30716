document.getElementById("formStudent").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const birthday = document.getElementById("birthday").value;

    if (name.length < 3) {
        showMessage("invalid name", "red");
        return;
    }

    if (!validateEmail(email)) {
        showMessage("invalid email", "red");
        return;
    }

    const data = {
        name: name,
        email: email,
        birthday: birthday
    };

    fetch("php/connect.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => res.text())
    .then(response => {
        showMessage(response, "green");
    })
    .catch(err => {
        showMessage("Error to send", "red");
    });
});

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showMessage(msg, color) {
    const p = document.getElementById("msg");
    p.textContent = msg;
    p.style.color = color;
}