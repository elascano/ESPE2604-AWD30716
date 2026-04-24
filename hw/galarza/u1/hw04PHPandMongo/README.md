<div align="center">

# 🐧 New Club Penguin - Registration Portal

<img src="https://img1.picmix.com/output/stamp/normal/2/7/4/9/2529472_d09bc.png" alt="CPPSFormLogo" width="400"/>

*An interactive, full-stack registration system featuring real-time dynamic avatars, secure authentication, and seamless database integration.*

</div>

---

## About The Project

This project is a fully functional web registration portal inspired by the classic Club Penguin experience. It allows new users to create an account, select their penguin's color in real-time using an interactive SVG/PNG overlay system, and securely store their credentials. It also includes a custom CAPTCHA system and referral code validation.

### Key Features
* **Dynamic Avatar Preview:** Real-time color selection using combined SVG paths and PNG overlays for an accurate preview.
* **Custom CAPTCHA:** Interactive, visual mini-game to verify human users before submission.
* **Secure Authentication:** Password hashing and session management (localStorage for persistent UI state).
* **Referral System:** Built-in logic to validate and process specific referral codes during sign-up.
* **Responsive UI:** Clean, gradient-based UI inspired by the original game's aesthetics, featuring toast notifications and modal dialogs.

---

<div align="center">
  <img src="https://clipart-library.com/images/dc964Xec7.png" alt="Penguin Avatar" width="200"/>
</div>

## Technologies Built With

This project follows a clean architecture separating the frontend interaction from the backend logic, ensuring scalability and readability.

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+).
* **Backend:** PHP 8.x.
* **Database:** MongoDB (via MongoDB Atlas).
* **Package Management:** Composer.

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
* PHP installed on your local machine.
* Composer (for dependency management).
* A MongoDB Atlas cluster or local MongoDB instance.

### Installation

- **Local Environment (By Code)**
1. Clone the repository: `https://github.com/DiverCesar/CPPS_Form.git`
2. Navigate to the project folder and run: composer install
3. Update the connection URI in config/db.php with your MongoDB credentials.
4. Open your browser and navigate to http://localhost:8000. Navigate the modules to register data.

- **Cloud Environment (By Browser)**
1. Access the deployed web application: `https://cppsform-production.up.railway.app/`
2. Navigate through the different inputs and look for interactive options.
3. Register new data through the form and immediately view the persisted records in the cloud-connected log-in.

## License

MIT License

Copyright (c) 2026 Galarza César

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
