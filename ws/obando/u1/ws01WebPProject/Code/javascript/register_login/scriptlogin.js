document.addEventListener("DOMContentLoaded", function () {
    const togglePasswordBtn = document.getElementById("togglePassword");
    const passwordField = document.getElementById("password");
    const toggleIcon = document.getElementById("toggleIcon");
    const form = document.getElementById("formLogin");
    const userField = document.getElementById("user");
    const mensajeError = document.getElementById("mensajeError");

    // Alternar la visibilidad de la contraseña
    togglePasswordBtn.addEventListener("click", function () {
        const tipo = passwordField.type === "password" ? "text" : "password";
        passwordField.type = tipo;

        // Cambiar el icono del botón
        if (passwordField.type === "password") {
            toggleIcon.classList.replace("bi-eye", "bi-eye-slash");
        } else {
            toggleIcon.classList.replace("bi-eye-slash", "bi-eye");
        }
    });

    
});
