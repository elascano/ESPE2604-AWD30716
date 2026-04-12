export class ErrorController {
    static init() {
        // Leer parámetros de la URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const msg = params.get('msg');

        if (code) {
            document.getElementById('error').innerText = code;
        }
        if (msg) {
            document.getElementById('pf_error').innerText = decodeURIComponent(msg);
        }
    }

    static redirect(code, msg) {
        window.location.href =
            `404.html?code=${code}&msg=${encodeURIComponent(msg)}`;
    }
}

// Ejecutar al cargar el DOM
document.addEventListener('DOMContentLoaded', ErrorController.init);