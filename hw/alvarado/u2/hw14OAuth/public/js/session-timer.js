(function () {
    'use strict';

    const headerTimer = document.getElementById('session-timer');
    const bannerTime  = document.getElementById('banner-time');
    const bannerBox   = document.getElementById('banner-timer');

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }


    function applyUrgencyStyles(remaining) {
        if (remaining <= 15) {

            if (headerTimer) {
                headerTimer.classList.add('text-red-400');
                headerTimer.classList.remove('text-white');
            }
            if (bannerTime) {
                bannerTime.classList.add('text-red-600');
                bannerTime.classList.remove('text-[#1a4731]');
            }
            if (bannerBox) {
                bannerBox.classList.add('border-red-300', 'bg-red-50');
                bannerBox.classList.remove('border-gray-200');
            }
        } else {

            if (headerTimer) {
                headerTimer.classList.remove('text-red-400');
                headerTimer.classList.add('text-white');
            }
            if (bannerTime) {
                bannerTime.classList.remove('text-red-600');
                bannerTime.classList.add('text-[#1a4731]');
            }
            if (bannerBox) {
                bannerBox.classList.remove('border-red-300', 'bg-red-50');
                bannerBox.classList.add('border-gray-200');
            }
        }
    }

    async function checkSession() {
        try {
            const response = await fetch('index.php?action=check_session', {
                method: 'GET',
                cache: 'no-store',
                credentials: 'same-origin'
            });

            if (!response.ok) throw new Error('Error de red');

            const data = await response.json();

            if (data.expired) {
                clearInterval(timerInterval);
                window.location.href = 'index.php?action=redirect_notice&from=expired';
                return;
            }

            const remaining = Math.max(0, Math.floor(data.remaining));
            const formatted  = formatTime(remaining);

            if (headerTimer) headerTimer.textContent = formatted;
            if (bannerTime)  bannerTime.textContent  = formatted;

            applyUrgencyStyles(remaining);

            if (remaining <= 0) {
                clearInterval(timerInterval);
                window.location.href = 'index.php?action=redirect_notice&from=expired';
            }

        } catch (error) {
            console.warn('Error al verificar sesión:', error);
        }
    }

    checkSession();
    const timerInterval = setInterval(checkSession, 1000);

})();
