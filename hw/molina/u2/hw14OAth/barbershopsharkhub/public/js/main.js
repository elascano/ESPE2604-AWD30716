let supabaseClientPromise = null;

(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $('.testimonial-carousel').owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        nav: false,
        dots: true,
        items: 1,
        dotsData: true,
    });


})(jQuery);

async function getSupabaseAuthClient() {
    if (supabaseClientPromise) {
        return supabaseClientPromise;
    }

    supabaseClientPromise = fetch('/api/auth/supabase-config', {
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error('No se pudo obtener la configuración de Supabase.');
            }

            return response.json();
        })
        .then(function (config) {
            return window.supabase.createClient(config.url, config.anonKey, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            });
        });

    return supabaseClientPromise;
}

document.addEventListener("DOMContentLoaded", function () {
    const mainContent = document.getElementById("main-content");
    const homeContent = mainContent ? mainContent.innerHTML : "";

    const sectionRoutes = {
        home: {
            visibleUrl: "/",
            contentUrl: null
        },
        about: {
            visibleUrl: "/about",
            contentUrl: "/info/content/about"
        },
        service: {
            visibleUrl: "/service",
            contentUrl: "/info/content/service"
        },
        price: {
            visibleUrl: "/price",
            contentUrl: "/info/content/price"
        },
        team: {
            visibleUrl: "/team",
            contentUrl: "/info/content/team"
        },
        open: {
            visibleUrl: "/open",
            contentUrl: "/info/content/open"
        },
        testimonial: {
            visibleUrl: "/testimonial",
            contentUrl: "/info/content/testimonial"
        },
        contact: {
            visibleUrl: "/contact",
            contentUrl: "/info/content/contact"
        },
        notFound: {
            visibleUrl: "/404",
            contentUrl: "/info/content/not-found"
        }
    };

    const pathToSection = {
        "/": "home",
        "/about": "about",
        "/service": "service",
        "/price": "price",
        "/team": "team",
        "/open": "open",
        "/testimonial": "testimonial",
        "/contact": "contact",
        "/404": "notFound"
    };

    function extractMainContent(htmlText) {
        const parser = new DOMParser();
        const parsedDocument = parser.parseFromString(htmlText, "text/html");
        const parsedMainContent = parsedDocument.querySelector("#main-content");

        if (!parsedMainContent) {
            return `
                <div class="container py-5">
                    <h1 class="text-uppercase">Contenido no encontrado</h1>
                    <p>No se pudo cargar el contenido solicitado.</p>
                </div>
            `;
        }

        return parsedMainContent.innerHTML;
    }

    function setActiveLink(sectionName) {
        document.querySelectorAll("[data-section]").forEach(function (link) {
            link.classList.remove("active");

            if (link.getAttribute("data-section") === sectionName) {
                link.classList.add("active");
            }
        });
    }

    function closeNavbarMenu() {
        const navbarCollapse = document.getElementById("navbarCollapse");

        if (navbarCollapse && navbarCollapse.classList.contains("show")) {
            const bootstrapCollapse = new bootstrap.Collapse(navbarCollapse, {
                toggle: false
            });

            bootstrapCollapse.hide();
        }
    }

    function restartTemplateAnimations() {
        if (typeof WOW !== "undefined") {
            new WOW().init();
        }

        if (window.jQuery && $(".testimonial-carousel").length > 0) {
            $(".testimonial-carousel").trigger("destroy.owl.carousel");

            $(".testimonial-carousel").owlCarousel({
                autoplay: true,
                smartSpeed: 1000,
                loop: true,
                nav: false,
                dots: true,
                items: 1,
                dotsData: true
            });
        }
    }

    function finishSectionLoad(sectionName, shouldScroll) {
        setActiveLink(sectionName);
        closeNavbarMenu();
        restartTemplateAnimations();

        if (shouldScroll) {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }

    function loadSection(sectionName, pushUrl = true, shouldScroll = true) {
        const route = sectionRoutes[sectionName];

        if (!route || !mainContent) {
            return;
        }

        if (sectionName === "home") {
            mainContent.innerHTML = homeContent;

            if (pushUrl && window.location.pathname !== route.visibleUrl) {
                window.history.pushState({ sectionName: sectionName }, "", route.visibleUrl);
            }

            finishSectionLoad(sectionName, shouldScroll);
            return;
        }

        mainContent.innerHTML = `
            <div class="container py-5">
                <p class="text-primary text-uppercase">Cargando...</p>
            </div>
        `;

        fetch(route.contentUrl)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Section could not be loaded");
                }

                return response.text();
            })
            .then(function (htmlText) {
                mainContent.innerHTML = extractMainContent(htmlText);

                if (pushUrl && window.location.pathname !== route.visibleUrl) {
                    window.history.pushState({ sectionName: sectionName }, "", route.visibleUrl);
                }

                finishSectionLoad(sectionName, shouldScroll);
            })
            .catch(function (error) {
                console.error(error);

                mainContent.innerHTML = `
                    <div class="container py-5">
                        <h1 class="text-uppercase">Error</h1>
                        <p>No se pudo cargar la sección seleccionada.</p>
                    </div>
                `;
            });
    }

    function loadSectionFromCurrentPath() {
        const sectionName = pathToSection[window.location.pathname] || "home";
        loadSection(sectionName, false, false);
    }

    function loadAuthSection(url, pushUrl = false) {
        if (!mainContent) {
            return;
        }

        mainContent.innerHTML = `
            <div class="container py-5">
                <p class="text-primary text-uppercase">Cargando...</p>
            </div>
        `;

        fetch(url)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Auth section could not be loaded");
                }

                return response.text();
            })
            .then(function (htmlText) {
                mainContent.innerHTML = extractMainContent(htmlText);
                closeNavbarMenu();

                if (pushUrl && window.location.pathname !== url) {
                    window.history.pushState({ authUrl: url }, "", url);
                }

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            })
            .catch(function (error) {
                console.error(error);

                mainContent.innerHTML = `
                    <div class="container py-5">
                        <h1 class="text-uppercase">Error</h1>
                        <p>No se pudo cargar el formulario solicitado.</p>
                    </div>
                `;
            });
    }

    document.body.addEventListener("click", function (event) {
        const sectionLink = event.target.closest("[data-section]");

        const googleLoginBtn = event.target.closest("#googleLoginBtn");

        if (googleLoginBtn) {
            event.preventDefault();

            googleLoginBtn.disabled = true;
            googleLoginBtn.innerHTML = 'Redirigiendo... <i class="fas fa-spinner fa-spin ms-2"></i>';

            getSupabaseAuthClient()
                .then(function (supabaseClient) {
                    return supabaseClient.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                            redirectTo: window.location.origin + '/auth/google/callback',
                            queryParams: {
                                prompt: 'select_account',
                            },
                        },
                    })
                })
                .catch(function (error) {
                    alert('No se pudo iniciar sesión con Google.');
                    console.error(error);

                    googleLoginBtn.disabled = false;
                    googleLoginBtn.innerHTML = 'Continuar con Google <i class="fab fa-google ms-2"></i>';
                });

            return;
        }

        if (sectionLink) {
            event.preventDefault();

            const sectionName = sectionLink.getAttribute("data-section");
            loadSection(sectionName, true, true);
            return;
        }

        const link = event.target.closest("a");

        if (!link) {
            return;
        }

        const href = link.getAttribute("href");

        if (href === "/customer/login" || href === "/customer/register") {
            event.preventDefault();
            loadAuthSection(href, true);
        }
    });

    // Handle Authentication Forms
    document.body.addEventListener("submit", async function (event) {
        if (event.target.matches("#loginForm")) {
            event.preventDefault();
            const form = event.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.innerHTML = 'Cargando... <i class="fas fa-spinner fa-spin ms-2"></i>';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const result = await response.json();

                if (result.success) {
                    window.location.href = result.redirect;
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                alert('Error al iniciar sesión.');
                console.error(error);
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        }

        if (event.target.matches("#registerForm")) {
            event.preventDefault();
            const form = event.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            submitBtn.innerHTML = 'Registrando... <i class="fas fa-spinner fa-spin ms-2"></i>';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const result = await response.json();

                if (result.success) {
                    alert('Registro exitoso. Ahora puedes iniciar sesión.');
                    loadAuthSection("/customer/login", true);
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                alert('Error en el registro.');
                console.error(error);
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        }
    });

    window.addEventListener("popstate", function () {
        if (window.location.pathname === "/customer/login" || window.location.pathname === "/customer/register") {
            loadAuthSection(window.location.pathname, false);
            return;
        }

        loadSectionFromCurrentPath();
    });

    if (window.location.pathname === "/customer/login" || window.location.pathname === "/customer/register") {
        loadAuthSection(window.location.pathname, false);
    } else {
        loadSectionFromCurrentPath();
    }
});
