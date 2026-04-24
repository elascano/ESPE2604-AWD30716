const form = document.getElementById("form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const age = formData.get("age").trim();

    if (!name) {
        alert("El nombre es obligatorio");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        alert("Ingresa un correo válido");
        return;
    }

    if (!age || isNaN(age) || age <= 0) {
        alert("Ingresa una edad válida");
        return;
    }

    try {
        const response = await fetch("src/controllers/formController.php", {
            method: "POST",
            body: formData
        });

        const text = await response.text(); 

        console.log(text);
        alert("El servidor respondió: " + text);

        form.reset();

    } catch (error) {
        console.error(error);
        alert("Error al conectar");
    }
});