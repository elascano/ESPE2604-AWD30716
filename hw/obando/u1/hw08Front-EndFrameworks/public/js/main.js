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

document.addEventListener("DOMContentLoaded", function () {
    const mainContent = document.getElementById("main-content");
    const sectionLinks = document.querySelectorAll("[data-section]");

    const sectionRoutes = {
        home: "/",
        about: "/about",
        service: "/service",
        price: "/price",
        team: "/team",
        open: "/open",
        testimonial: "/testimonial",
        contact: "/contact",
        notFound: "/404",
        login: "/client/login",
        register: "/client/register"
    };

    function extractMainContent(htmlText) {
        const parser = new DOMParser();
        const parsedDocument = parser.parseFromString(htmlText, "text/html");
        const parsedMainContent = parsedDocument.querySelector("#main-content");

        if (!parsedMainContent) {
            return `
                <div class="container py-5">
                    <h1 class="text-uppercase">Content not found</h1>
                    <p>The requested content could not be loaded.</p>
                </div>
            `;
        }

        return parsedMainContent.innerHTML;
    }

    function setActiveLink(sectionName) {
        sectionLinks.forEach(function (link) {
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

    function loadSection(sectionName) {
        const route = sectionRoutes[sectionName];

        if (!route || !mainContent) {
            return;
        }

        fetch(route)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Section could not be loaded");
                }

                return response.text();
            })
            .then(function (htmlText) {
                mainContent.innerHTML = extractMainContent(htmlText);
                setActiveLink(sectionName);
                closeNavbarMenu();
                restartTemplateAnimations();

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
                        <p>The selected section could not be loaded.</p>
                    </div>
                `;
            });
    }

    sectionLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            const sectionName = this.getAttribute("data-section");
            loadSection(sectionName);
        });
    });


    document.body.addEventListener("click", function (event) {
        const link = event.target.closest("a");
        if (link) {
            const href = link.getAttribute("href");
            if (href === "/client/login") {
                event.preventDefault();
                loadSection("login");
            } else if (href === "/client/register") {
                event.preventDefault();
                loadSection("register");
            }
        }
    });
});

