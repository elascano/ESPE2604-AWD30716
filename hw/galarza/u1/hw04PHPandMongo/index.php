<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - New Club Penguin</title>
    <link rel="icon" href="https://cdn2.steamgriddb.com/icon/e5860ae00103b3869a25d940345bf0fd.png" type="image/png">
    <link rel="stylesheet" href="lib/css/style.css">
</head>
<body>
    <?php include 'lib/components/navbar.php'; ?>
    <?php include 'lib/components/login_modal.php'; ?>

    <main class="container">
        <div class="register-grid">
            <div class="left-col">
                <div class="paperdoll-container">
                    <div class="step-number">1.</div>
                    <div class="color-picker" id="colorPicker"></div>
                    <div class="penguin-avatar">
                        <?php include 'lib/components/penguin.php'; ?>
                    </div>
                </div>
                
                <div class="referral-section">
                    <label class="referral-label" for="referralCode">Referral Code (Optional)</label>
                    <input type="text" class="referral-input" placeholder="REFERRAL CODE" name="referral_code" id="referralCode">
                    <div class="referral-hint">
                        If applicable, entering a referral code will give you, and the penguin the code belongs to '500 coins'.
                    </div>
                </div>
            </div>

            <div class="right-col">
                <form id="registerForm" novalidate>
                    <div class="input-group">
                        <div class="input-number">2.</div>
                        <div class="input-content">
                            <label class="input-label" for="penguinName">Create a Penguin Name</label>
                            <input type="text" class="form-input validate-target" placeholder="PENGUIN NAME" name="penguin_name" id="penguinName" required minlength="4" maxlength="12" pattern="[a-zA-Z0-9]+" autocomplete="off">
                        </div>
                    </div>

                    <div class="input-group">
                        <div class="input-number">3.</div>
                        <div class="input-content">
                            <label class="input-label" for="password">Create a Password</label>
                            <input type="password" class="form-input validate-target" placeholder="PASSWORD" name="password" id="password" required minlength="6" autocomplete="new-password">
                        </div>
                    </div>

                    <div class="show-password-container">
                        <button type="button" class="show-password-btn" id="showPasswordBtn">
                            SHOW PASSWORD <span class="status off" id="passwordStatus">OFF</span>
                        </button>
                    </div>

                    <div class="input-group">
                        <div class="input-number">4.</div>
                        <div class="input-content">
                            <label class="input-label" for="parentEmail">Your Parent's Email</label>
                            <input type="email" class="form-input validate-target" placeholder="PARENT EMAIL" name="parent_email" id="parentEmail" required pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$" autocomplete="email">
                        </div>
                    </div>

                    <div class="agreement-section">
                        <label class="toggle-switch">
                            <input type="checkbox" id="agreeTerms" name="agree_terms" required>
                            <span class="toggle-slider"></span>
                        </label>
                        <div class="agreement-text">
                            I agree to the <a href="/legal" target="_blank">TERMS OF USE</a> and <a href="/rules" target="_blank">NEW CLUB PENGUIN RULES</a>.<br>
                            For more information on our Privacy Policy, <a href="/privacy" target="_blank">click here</a>.
                        </div>
                    </div>

                    <div class="captcha-section">
                        <div class="captcha-title">PICK THE <span class="captcha-item" id="captchaItem">WATERMELON</span></div>
                            <div class="captcha-options" id="captchaOptions">
                                <div class="captcha-choice" data-item="popcorn">
                                    <svg viewBox="0 0 50 50">
                                        <rect x="12" y="25" width="26" height="22" rx="3" fill="#cc0000"/>
                                        <rect x="14" y="27" width="6" height="18" fill="#ff3333"/>
                                        <rect x="22" y="27" width="6" height="18" fill="#ff3333"/>
                                        <rect x="30" y="27" width="6" height="18" fill="#ff3333"/>
                                        <circle cx="18" cy="18" r="7" fill="#ffffcc"/>
                                        <circle cx="25" cy="14" r="8" fill="#ffffcc"/>
                                        <circle cx="32" cy="18" r="7" fill="#ffffcc"/>
                                        <circle cx="22" cy="22" r="5" fill="#ffffcc"/>
                                        <circle cx="28" cy="22" r="5" fill="#ffffcc"/>
                                    </svg>
                                </div>
                                <div class="captcha-choice" data-item="cheese">
                                    <svg viewBox="0 0 50 50">
                                        <polygon points="5,40 45,40 45,20 25,10" fill="#ffcc00"/>
                                        <polygon points="5,40 45,40 45,35 5,35" fill="#ddaa00"/>
                                        <circle cx="20" cy="30" r="4" fill="#ddaa00"/>
                                        <circle cx="35" cy="25" r="3" fill="#ddaa00"/>
                                        <circle cx="28" cy="35" r="2" fill="#ddaa00"/>
                                    </svg>
                                </div>
                                <div class="captcha-choice" data-item="watermelon">
                                    <svg viewBox="0 0 50 50">
                                        <path d="M5 35 Q25 5 45 35 Z" fill="#228B22"/>
                                        <path d="M8 34 Q25 10 42 34 Z" fill="#90EE90"/>
                                        <path d="M10 33 Q25 12 40 33 Z" fill="#ff6b6b"/>
                                        <ellipse cx="20" cy="28" rx="2" ry="3" fill="#333"/>
                                        <ellipse cx="30" cy="28" rx="2" ry="3" fill="#333"/>
                                        <ellipse cx="25" cy="25" rx="2" ry="3" fill="#333"/>
                                    </svg>
                                </div>
                            </div>
                        <input type="hidden" name="captcha_answer" id="captchaAnswer" required>
                        <input type="hidden" name="captcha_correct" id="captchaCorrect">
                        <input type="hidden" name="penguin_color" id="penguinColor" value="1">
                    </div>

                    <button type="submit" class="submit-btn" id="submitBtn" disabled>CREATE YOUR PENGUIN</button>
                </form>
            </div>
        </div>
    </main>
    <script src="lib/js/main.js"></script>
</body>
</html>
