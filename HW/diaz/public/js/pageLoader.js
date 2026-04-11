function loadPage(event, pageUrl) {
    // Prevenir el comportamiento por defecto del enlace
    event.preventDefault();

    // Obtener el contenedor principal
    const mainContent = document.querySelector('.main-content');

    if (!mainContent) {
        console.error('No se encontró el contenedor .main-content');
        return;
    }

    mainContent.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';

    // Realizar la solicitud fetch
    fetch(pageUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const mainElement = doc.querySelector('main') || doc.body;

            mainContent.innerHTML = mainElement.innerHTML;

            loadPageStyles(pageUrl, doc);
            executeScripts(mainElement, pageUrl).then(() => {
                if (window.ProductosLibreria && typeof window.ProductosLibreria.init === 'function') {
                    window.ProductosLibreria.init();
                }
                if (window.AgregarLibro && typeof window.AgregarLibro.init === 'function') {
                    window.AgregarLibro.init();
                }
            });
            updatePageTitle(doc);
        })
        .catch(error => {
            console.error('Error:', error);
            mainContent.innerHTML = `<div class="alert alert-danger m-5" role="alert">Error al cargar la página: ${error.message}</div>`;
        });
}

function loadPageStyles(pageUrl, doc) {
    let loadedFromDoc = false;

    if (doc) {
        const baseUrl = new URL(pageUrl, window.location.href);
        const links = doc.querySelectorAll('link[rel="stylesheet"][href]');

        links.forEach(linkEl => {
            const href = linkEl.getAttribute('href');
            if (!href) return;

            const resolvedUrl = new URL(href, baseUrl).toString();
            const existingLink = document.querySelector(`link[href="${resolvedUrl}"]`);
            if (!existingLink) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = resolvedUrl;
                document.head.appendChild(link);
            }
            loadedFromDoc = true;
        });
    }

    if (loadedFromDoc) return;

    // Fallback: cargar CSS por nombre de página
    const pageName = pageUrl.split('/').pop().replace('.html', '');
    const cssUrl = `./public/css/${pageName}.css`;

    const existingLink = document.querySelector(`link[href="${cssUrl}"]`);
    if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssUrl;
        document.head.appendChild(link);
    }
}

function executeScripts(element, pageUrl) {
    const scripts = element.querySelectorAll('script');
    const loadPromises = [];
    const baseUrl = pageUrl ? new URL(pageUrl, window.location.href) : null;

    scripts.forEach(script => {
        const srcAttr = script.getAttribute('src');
        if (srcAttr) {
            const resolvedSrc = baseUrl ? new URL(srcAttr, baseUrl).toString() : srcAttr;
            const existing = document.querySelector(`script[src="${resolvedSrc}"]`);
            if (existing) return;

            const newScript = document.createElement('script');
            newScript.src = resolvedSrc;
            loadPromises.push(
                new Promise(resolve => {
                    newScript.onload = () => resolve();
                    newScript.onerror = () => resolve();
                })
            );
            document.body.appendChild(newScript);
            return;
        }

        const newScript = document.createElement('script');
        newScript.innerHTML = script.innerHTML;
        document.body.appendChild(newScript);
    });

    return Promise.all(loadPromises);
}

function updatePageTitle(doc) {
    const pageTitle = doc.querySelector('title');
    if (pageTitle) {
        document.title = pageTitle.textContent;
    }
}

// Cargar la página de inicio (home) cuando se carga el index
document.addEventListener('DOMContentLoaded', () => {
    loadPage({ preventDefault: () => { } }, './view/home.html');
});
