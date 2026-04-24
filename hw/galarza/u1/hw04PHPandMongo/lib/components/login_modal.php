<div class="modal-overlay" id="loginModal">
    <div class="modal-content">
        <div class="modal-header">
            <button class="btn-close" id="closeLoginModal">&times;</button>
        </div>
        <div class="modal-body">
            <div class="modal-logo">
                <img src="https://static.wikia.nocookie.net/newclubpenguin/images/a/a4/NewCPLogo.png/revision/latest/scale-to-width-down/1200?cb=20200521225237" alt="Logo" class="modal-logo-img">
            </div>
            <form id="loginForm">
                <div class="input-group-modal tooltip-container">
                    <label class="modal-label" for="loginUsername">Penguin Name</label>
                    <input type="text" id="loginUsername" class="modal-input" placeholder="Penguin Name" autocomplete="off">
                    <div class="tooltip-error" id="loginErrorTooltip">
                        <span class="error-icon">!</span>
                        This username does not exist
                    </div>
                </div>
                <div class="input-group-modal">
                    <label class="modal-label" for="loginPassword">Password</label>
                    <input type="password" id="loginPassword" class="modal-input" placeholder="Password" autocomplete="current-password">
                </div>
                <button type="submit" class="modal-submit-btn">SIGN IN</button>
            </form>
            <div class="modal-notice">
                <a href="" onclick="location.reload(); return false;" class="modal-notice-link">Don't have an account?</a>
            </div>
        </div>
    </div>
</div>