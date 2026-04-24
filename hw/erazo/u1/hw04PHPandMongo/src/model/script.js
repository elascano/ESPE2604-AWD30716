const registryForm = document.querySelector(".registry-form");

const showMessage = (options) => Swal.fire({
    confirmButtonColor: "#f3c846",
    background: "#0c1220",
    color: "#f7f2cf",
    ...options
});

const validateRegistry = ({ name, email, age }) => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const numericAge = Number(age);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (trimmedName.length < 3) {
        return "Name must contain at least 3 characters.";
    }

    if (!emailPattern.test(trimmedEmail)) {
        return "Email must have a valid format.";
    }

    if (!Number.isInteger(numericAge) || numericAge < 1 || numericAge > 120) {
        return "Age must be an integer between 1 and 120.";
    }

    return "";
};

registryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const registryData = {
        name: registryForm.name.value,
        email: registryForm.email.value,
        age: registryForm.age.value
    };

    const validationMessage = validateRegistry(registryData);

    if (validationMessage) {
        await showMessage({
            icon: "warning",
            title: "Incomplete transmission",
            text: validationMessage
        });
        return;
    }

    Swal.fire({
        title: "Sending transmission",
        text: "The registry is connecting with MongoDB Atlas.",
        allowOutsideClick: false,
        background: "#0c1220",
        color: "#f7f2cf",
        didOpen: () => Swal.showLoading()
    });

    try {
        const response = await fetch(registryForm.action, {
            method: "POST",
            body: new FormData(registryForm)
        });

        Swal.close();

        if (!response.ok) {
            if (response.status === 405) {
                await showMessage({
                    icon: "error",
                    title: "PHP server required",
                    text: "Live Server cannot process PHP POST requests. Open this project with Apache, XAMPP, WAMP, Laragon, or php -S instead of port 5501."
                });
                return;
            }

            await showMessage({
                icon: "error",
                title: "Request rejected",
                text: `The server responded with status ${response.status}.`
            });
            return;
        }

        const serviceResponse = await response.json();

        await showMessage({
            icon: serviceResponse.status,
            title: serviceResponse.message,
            text: serviceResponse.details
        });

        if (serviceResponse.status === "success") {
            registryForm.reset();
        }
    } catch (error) {
        Swal.close();

        await showMessage({
            icon: "error",
            title: "Connection failed",
            text: "The request could not reach the server."
        });
    }
});
