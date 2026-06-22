document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', (event) => {
        const user = form["username"].value.trim();
        const pass = form["password"].value.trim();

        if (user === "" || pass === "") {
            alert("Todos los campos son obligatorios.");
            event.preventDefault();
            return;
        }

        const userRegex = /^[a-zA-Z0-9]+$/;
        if (!userRegex.test(user)) {
            alert("El usuario solo puede contener letras y números (sin espacios ni caracteres especiales).");
            event.preventDefault();
            return;
        }

        if (pass.length > 8) {
            alert("La contraseña no debe exceder los 8 caracteres.");
            event.preventDefault();
            return;
        }

        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
        if (!passRegex.test(pass)) {
            alert("La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo especial.");
            event.preventDefault();
            return;
        }
    });
});