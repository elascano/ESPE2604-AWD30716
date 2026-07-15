document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const counter = document.getElementById('slide-counter');
    const progressBar = document.getElementById('progress-bar');

    let currentSlideIndex = 0;
    const totalSlides = slides.length;

    // Initialize
    updateControls();

    // Navigation Functions
    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;

        // Remove active class and add previous/next direction class for transitions
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'previous');
            if (i < index) {
                slide.classList.add('previous'); // Move to left
            }
        });

        // Activate new slide
        currentSlideIndex = index;
        slides[currentSlideIndex].classList.add('active');
        slides[currentSlideIndex].classList.remove('previous');

        // Re-trigger animations in active slide
        const animatedElements = slides[currentSlideIndex].querySelectorAll('.slide-up, .fade-in, .bounce');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // trigger reflow
            el.style.animation = null;
        });

        updateControls();
    }

    function updateControls() {
        // Update Counter
        counter.textContent = `${currentSlideIndex + 1} / ${totalSlides}`;

        // Update Progress Bar
        const progressPercentage = ((currentSlideIndex) / (totalSlides - 1)) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        // Update Buttons
        prevBtn.disabled = currentSlideIndex === 0;
        nextBtn.disabled = currentSlideIndex === totalSlides - 1;
    }

    // Event Listeners for Buttons
    nextBtn.addEventListener('click', () => goToSlide(currentSlideIndex + 1));
    prevBtn.addEventListener('click', () => goToSlide(currentSlideIndex - 1));

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'Enter') {
            goToSlide(currentSlideIndex + 1);
        } else if (e.key === 'ArrowLeft') {
            goToSlide(currentSlideIndex - 1);
        }
    });

    // Global Tooltip Logic for Hover effects
    const tooltipElement = document.getElementById('global-tooltip');
    const triggerElements = document.querySelectorAll('.tooltip-trigger, [data-hover]');

    triggerElements.forEach(trigger => {
        trigger.addEventListener('mouseenter', (e) => {
            const tooltipText = trigger.getAttribute('data-tooltip') || trigger.getAttribute('data-hover');
            if (!tooltipText) return;

            tooltipElement.textContent = tooltipText;
            tooltipElement.classList.add('show');

            // Calculate Position
            const rect = trigger.getBoundingClientRect();

            // Center horizontally relative to target
            let left = rect.left + (rect.width / 2) - (tooltipElement.offsetWidth / 2);
            let top = rect.top - tooltipElement.offsetHeight - 15; // Position above

            // Prevent going off screen (left/right)
            if (left < 10) left = 10;
            if (left + tooltipElement.offsetWidth > window.innerWidth - 10) {
                left = window.innerWidth - tooltipElement.offsetWidth - 10;
            }

            // If goes off top screen, position below
            if (top < 10) {
                top = rect.bottom + 15;
            }

            tooltipElement.style.left = `${left}px`;
            tooltipElement.style.top = `${top}px`;
        });

        trigger.addEventListener('mouseleave', () => {
            tooltipElement.classList.remove('show');
        });
    });
});
