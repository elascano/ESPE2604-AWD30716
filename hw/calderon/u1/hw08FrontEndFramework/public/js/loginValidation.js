// JavaScript Document

function validateAndSubmitLogin(event) {
    event.preventDefault();

    const form = event.target;

    const userIdentifier = form.user_identifier.value.trim();
    const password = form.password.value.trim();

    const errorElement = document.getElementById("loginError");

    if (userIdentifier === "" || password === "") {
        if (errorElement) {
            errorElement.textContent = "All fields are required";
        } else {
            alert("All fields are required");
        }
        return;
    }

    if (password.length < 4) {
        if (errorElement) {
            errorElement.textContent = "Password must be at least 4 characters";
        } else {
            alert("Password too short");
        }
        return;
    }

    if (errorElement) errorElement.textContent = "";

    submitLogin(form);
}

async function submitLogin(form) {
    const formData = new FormData(form);

    const loginData = {
        user_identifier: formData.get('user_identifier'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('/backend/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        const result = await response.json();

        if (result.success) {
            alert("Login successful");

            window.location.href = "../index.php";
        } else {
            showError(result.error || "Invalid credentials");
        }

    } catch (error) {
        showError("Connection error");
    }
}

function showError(message) {
    const errorElement = document.getElementById("loginError");

    if (errorElement) {
        errorElement.textContent = message;
    } else {
        alert(message);
    }
}