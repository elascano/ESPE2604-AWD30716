const PENGUIN_COLORS = [
    { id: 1, color: '#003366' }, { id: 2, color: '#009900' },
    { id: 3, color: '#ff3399' }, { id: 4, color: '#333333' },
    { id: 5, color: '#cc0000' }, { id: 6, color: '#ff6600' },
    { id: 7, color: '#ffcc00' }, { id: 8, color: '#660099' },
    { id: 9, color: '#996600' }, { id: 10, color: '#ff6666' },
    { id: 11, color: '#006600' }, { id: 12, color: '#0099cc' },
    { id: 13, color: '#8ae302' }, { id: 14, color: '#02a797' },
    { id: 15, color: '#f0f0d8' }, { id: 16, color: '#cbb9f3' }
];

document.addEventListener('DOMContentLoaded', () => {
    initColorPicker();
    initDropdown();
    initLoginState();
    initFormValidation();
    initCaptcha();
    initPasswordToggle();
    initReferralValidation();
    initUsernameAvailability();
});

function initUsernameAvailability() {
    const input = document.getElementById('penguinName');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-error';
    tooltip.innerHTML = '<span class="error-icon">!</span>Username already exists';
    input.parentNode.appendChild(tooltip);

    input.addEventListener('blur', async () => {
        const name = input.value.trim();
        if (name.length < 4) return;

        try {
            const response = await fetch(`api/check_username.php?name=${encodeURIComponent(name)}`);
            const data = await response.json();

            if (data.exists) {
                input.setCustomValidity("Taken");
                tooltip.classList.add('show');
            } else {
                input.setCustomValidity("");
                tooltip.classList.remove('show');
            }
            validateFullForm();
        } catch (e) {
            console.error(e);
        }
    });

    input.addEventListener('input', () => {
        input.setCustomValidity("");
        tooltip.classList.remove('show');
    });
}

function initColorPicker() {
    const container = document.getElementById('colorPicker');
    const svgWrapper = document.getElementById('penguinSvgWrapper');
    const inputColor = document.getElementById('penguinColor');
    
    PENGUIN_COLORS.forEach((c, i) => {
        const angle = (i * (360 / 16) - 90) * (Math.PI / 180);
        const radius = 175;
        const centerX = 190;
        const centerY = 190;
        const x = centerX + radius * Math.cos(angle) - 17;
        const y = centerY + radius * Math.sin(angle) - 17;

        const btn = document.createElement('div');
        btn.className = 'color-btn' + (i === 0 ? ' active' : '');
        btn.style.backgroundColor = c.color;
        btn.style.left = `${x}px`;
        btn.style.top = `${y}px`;

        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            inputColor.value = c.id;
            svgWrapper.style.setProperty('--penguin-fill', c.color);
        });

        container.appendChild(btn);
    });
}

function initDropdown() {
    const avatarBtn = document.getElementById('avatarDropdownBtn');
    const menu = document.getElementById('userDropdown');

    avatarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        menu.classList.remove('show');
    });
}

function initLoginState() {
    const modal = document.getElementById('loginModal');
    const form = document.getElementById('loginForm');
    const savedUser = localStorage.getItem('loggedUser');

    if (savedUser) {
        const userData = JSON.parse(savedUser);
        setLoggedInUI(userData.username, userData.colorHex);
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('#triggerLoginModal')) {
            modal.classList.add('show');
        }
        if (e.target.closest('#closeLoginModal')) {
            modal.classList.remove('show');
        }
        if (e.target.closest('#triggerLogout')) {
            localStorage.removeItem('loggedUser');
            document.getElementById('navbarAvatar').innerHTML = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#777777"/><circle cx="50" cy="40" r="18" fill="#AAAAAA"/><path d="M 20 85 Q 50 45 80 85 Z" fill="#AAAAAA"/></svg>';
            document.getElementById('navbarAvatar').classList.remove('logged-in');
            document.getElementById('userDropdown').innerHTML = '<button class="dropdown-item" id="triggerLoginModal"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>Login</button>';
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const usernameInput = document.getElementById('loginUsername');
        const passwordInput = document.getElementById('loginPassword');
        
        try {
            const formData = new FormData();
            formData.append('username', usernameInput.value.trim());
            formData.append('password', passwordInput.value);

            const response = await fetch('api/login.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('loggedUser', JSON.stringify({ 
                    username: usernameInput.value.trim(), 
                    colorHex: data.color 
                }));
                setLoggedInUI(usernameInput.value.trim(), data.color);
                modal.classList.remove('show');
            } else {
                usernameInput.classList.add('has-error');
                const tooltip = document.getElementById('loginErrorTooltip');
                if (tooltip) {
                    tooltip.innerHTML = `<span class="error-icon">!</span>${data.message}`;
                    tooltip.classList.add('show');
                }
            }
        } catch (error) {
            console.error(error);
        }
    });

    const loginUsernameInput = document.getElementById('loginUsername');
    if (loginUsernameInput) {
        loginUsernameInput.addEventListener('input', (e) => {
            e.target.classList.remove('has-error');
            const tooltip = document.getElementById('loginErrorTooltip');
            if (tooltip) tooltip.classList.remove('show');
        });
    }
}

function setLoggedInUI(username, colorHex) {
    const pathElement = document.querySelector('#penguinSvgWrapper path');
    if (!pathElement) return;
    
    const pathData = pathElement.getAttribute('d');
    
    document.getElementById('navbarAvatar').innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1422 1891" style="width: 95%; height: 95%; transform: translateY(15%); position: absolute; z-index: 1;">
            <path style="fill: ${colorHex};" d="${pathData}"></path>
        </svg>
        <img src="https://res.cloudinary.com/dyqrc7mxj/image/upload/v1777025168/PNGPengu_ni3j8w.png" style="width: 95%; height: 95%; transform: translateY(15%); position: absolute; z-index: 2; pointer-events: none;" alt="">
    `;
    
    document.getElementById('navbarAvatar').classList.add('logged-in');
    
    document.getElementById('userDropdown').innerHTML = `
        <div class="dropdown-item" style="font-weight: bold; border-bottom: 1px solid #eee; cursor: default;">${username}</div>
        <button class="dropdown-item" id="triggerLogout">
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
            Log Out
        </button>
    `;
}

function initPasswordToggle() {
    const btn = document.getElementById('showPasswordBtn');
    const input = document.getElementById('password');
    const status = document.getElementById('passwordStatus');
    let isShown = false;

    btn.addEventListener('click', () => {
        isShown = !isShown;
        input.type = isShown ? 'text' : 'password';
        status.textContent = isShown ? 'ON' : 'OFF';
        if(isShown) status.classList.remove('off');
        else status.classList.add('off');
    });
}

function initCaptcha() {
    const items = ['watermelon', 'popcorn', 'cheese'];
    const current = items[Math.floor(Math.random() * items.length)];
    
    document.getElementById('captchaItem').textContent = current.toUpperCase();
    document.getElementById('captchaCorrect').value = current;

    document.querySelectorAll('.captcha-choice').forEach(choice => {
        choice.addEventListener('click', () => {
            document.querySelectorAll('.captcha-choice').forEach(c => c.classList.remove('selected'));
            choice.classList.add('selected');
            document.getElementById('captchaAnswer').value = choice.dataset.item;
            validateFullForm();
        });
    });
}

function initReferralValidation() {
    const refInput = document.getElementById('referralCode');
    
    refInput.addEventListener('input', () => {
        const val = refInput.value.trim().toUpperCase();
        if (val !== "" && val !== "NCPPHP2026") {
            refInput.setCustomValidity("Invalid");
        } else {
            refInput.setCustomValidity("");
        }
        validateFullForm();
    });
}

function initFormValidation() {
    const form = document.getElementById('registerForm');
    const inputs = form.querySelectorAll('input');

    inputs.forEach(input => {
        input.addEventListener('input', validateFullForm);
        input.addEventListener('change', validateFullForm);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        if (!submitBtn.disabled) {
            const formData = new FormData(form);
            formData.append('referral_code', document.getElementById('referralCode').value.trim());
            
            try {
                const response = await fetch('api/register.php', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if(data.success) {
                    showToast(data.message, true);
                } else {
                    showToast(data.message, false);
                }
            } catch (error) {
                showToast("Connection error. Please try again.", false);
            }
        }
    });
}

function validateFullForm() {
    const form = document.getElementById('registerForm');
    const submitBtn = document.getElementById('submitBtn');
    const captchaAns = document.getElementById('captchaAnswer').value;
    const captchaCorr = document.getElementById('captchaCorrect').value;
    const refVal = document.getElementById('referralCode').value.trim().toUpperCase();
    const emailVal = document.getElementById('parentEmail').value.trim();
    
    const isCaptchaValid = (captchaAns === captchaCorr);
    const isRefValid = (refVal === "" || refVal === "NCPPHP2026");
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(emailVal);
    const isFormValid = form.checkValidity();
    
    const isValid = isFormValid && isCaptchaValid && isRefValid && isEmailValid;
    submitBtn.disabled = !isValid;
}

function showToast(message, isSuccess) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `toast-notification ${isSuccess ? 'toast-success' : 'toast-error'}`;
    
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
            if(isSuccess) {
                window.location.reload();
            }
        }, 500);
    }, 4000);
}