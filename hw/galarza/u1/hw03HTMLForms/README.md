# FLOVA Clinical Management System - Comprehensive Rehabilitation Web Platform

## Project Description

**FLOVA Clinical Management** is a web-based administrative platform developed for academic purposes. It simulates a complete clinic management system aimed at handling patient intake, scheduling physical therapies, and managing specialist directories for a rehabilitation center. 

We highlight its development using a Backend-as-a-Service (BaaS) architecture with **Supabase**. It manages business logic, database operations, and data persistence entirely through **Vanilla JavaScript** and CDN imports. This approach allows for a fast, fluid, and scalable user experience without the need for a traditional, complex Node.js backend environment.

## Main Features

- **Digital Patient Intake:** Secure registration of demographic data directly linked to a unique ID (DNI), eliminating manual paperwork and centralizing medical records.
- **Smart Booking Engine:** Automated scheduling system that organizes therapy sessions (Traumatological, Neurological, Sports) and registers them directly into the cloud database.
- **Specialist Directory:** Management of the clinic's medical staff, assigning and displaying specific areas of expertise for each professional.
- **Real-Time Data Filtering:** Dynamic HTML tables with integrated search engines that filter and display database records instantly on the client side.
- **Cloud Database Persistence:** Direct connection to a PostgreSQL database via Supabase's REST API, ensuring secure and permanent data storage.

## Future Expectations & Scalability

As part of the project's continuous improvement lifecycle, the following features are planned for future iterations:
- **Authentication & Security:** Implementation of Supabase Auth and Row Level Security (RLS) to restrict data access based on user roles (Admin, Therapist, Patient).
- **Automated Voucher Generation:** Integration with `jsPDF` to generate downloadable appointment receipts for patients upon booking.
- **Financial & Clinical Dashboard:** A visual metrics panel calculating Clinic Occupation Rates, No-Show penalties, and Financial Credit Balances for purchased session packages.
- **Cancellation Policy Enforcement:** Time-validation logic to prevent appointment modifications or cancellations with less than 12 hours of notice.

## Technologies Used

* **Structure and Design:** Semantic HTML5 and Modular CSS3.
* **Business Logic:** Vanilla JavaScript (ES6+), DOM Manipulation, and Asynchronous Operations (Async/Await).
* **Backend & Database:** Supabase (PostgreSQL, Data API).
* **Cloud Deployment:** Vercel.
* **Version Control:** Git and GitHub.

## Execution

- **Local Environment (By Code)**
1. Clone the repository: `https://github.com/DiverCesar/HTMLForms.git`
2. Open `index.html` in your browser using a local web server (e.g., Live Server extension in VS Code).
3. Navigate the modules to register data. *(Note: Ensure the `SUPABASE_URL` and `SUPABASE_KEY` are active in `app.js`).*

- **Cloud Environment (By Browser)**
1. Access the deployed web application: `https://htmlforms-two.vercel.app/index.html`
2. Navigate through the different modules (Patient Intake, Booking Engine, Staff Directory).
3. Register new data through the forms and immediately view the persisted records in the cloud-connected tables.

## License

MIT License

Copyright (c) 2026 Galarza César, Erazo Isaac, Gualotuña Brayan

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
