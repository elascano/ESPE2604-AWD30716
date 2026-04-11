function actualizarReloj() {
    const now = new Date();
    document.getElementById("reloj").innerHTML =
        now.toLocaleDateString() + " " + now.toLocaleTimeString();
}
setInterval(actualizarReloj, 1000);
actualizarReloj();