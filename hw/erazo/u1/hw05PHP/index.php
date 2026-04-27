<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SER SALUD Clinical Management</title>
    <link rel="stylesheet" href="src/css/styles.css">
    <link rel="icon" href="https://res.cloudinary.com/dyqrc7mxj/image/upload/v1777267507/SerSaludVinietaPNG_ho0saz.png" type="image/png">
</head>
<body>
    <nav class="navbar">
        <a href="index.php" class="logo">
            <img src="https://res.cloudinary.com/dyqrc7mxj/image/upload/v1777267506/SerSaludGrandePNG_yvat7q.png" alt="SER SALUD" class="logo-img">
        </a>
        <ul class="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>

    <section class="hero" id="home">
        <div class="hero-copy">
            <span class="eyebrow">Comprehensive Rehabilitation Clinic</span>
            <h1>A presentation website for the SER SALUD prototype and the main things this system will help the clinic do.</h1>
            <p>
                Built for <strong>David Alejandro Flores Villalva</strong>, this page is meant to explain the idea of the
                project in a clean and simple way, not to act as the full final SER SALUD platform.
            </p>
            <p>
                <em>"What is important is not being able, what is important is trying."</em>
            </p>
            <div class="hero-actions">
                <a href="#features" class="btn-primary">See Features</a>
                <a href="#contact" class="btn-secondary">Project Info</a>
            </div>
        </div>
        <div class="hero-visual">
            <img src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1200&q=80" alt="Rehabilitation clinic team">
            <div class="hero-badge">
                <strong>Current prototype</strong>
                Patient registration, appointment scheduling, specialist information, and simple record tables.
            </div>
        </div>
    </section>

    <section class="info-strip">
        <article>
            <span>Patients</span>
            <p>The site explains how a patient can be identified by DNI and stored in the system.</p>
        </article>
        <article>
            <span>Appointments</span>
            <p>The prototype presents a simple booking flow for therapy sessions by date and area.</p>
        </article>
        <article>
            <span>Specialists</span>
            <p>The clinic can show who works in the team and the areas each professional handles.</p>
        </article>
    </section>

    <section class="section-block" id="features">
        <h2 class="section-title">Current Features</h2>
        <p class="section-lead">
            These are the modules currently represented in the prototype. Additional features can be added later
            when more pages and tables are developed.
        </p>

        <div class="cards-section">
            <article class="card">
                <img class="feature-image" src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=1200&q=80" alt="Patient registration and personal data">
                <div class="card-body">
                    <span class="card-tag">Current Module</span>
                    <h3>User Management by ID</h3>
                    <p>Explains how patients can be registered using DNI and basic personal information as the starting point of the system.</p>
                    <a href="src/roles/patient/patient_info.php" class="btn-primary">Open Module</a>
                </div>
            </article>

            <article class="card">
                <img class="feature-image" src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80" alt="Appointment booking calendar">
                <div class="card-body">
                    <span class="card-tag">Current Module</span>
                    <h3>Booking Scheduling System</h3>
                    <p>Shows how the clinic can organize appointments by therapy area and date through a simple scheduling interface.</p>
                    <a href="src/roles/appointment/appointment_info.php" class="btn-primary">Open Module</a>
                </div>
            </article>

            <article class="card">
                <img class="feature-image" src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80" alt="Healthcare specialist team">
                <div class="card-body">
                    <span class="card-tag">Current Module</span>
                    <h3>Specialist Information</h3>
                    <p>Presents the professional team, their specialties, and the services the clinic wants to communicate to patients.</p>
                    <a href="src/roles/specialist/specialist_info.php" class="btn-primary">Open Module</a>
                </div>
            </article>
        </div>
    </section>

    <section class="section-block" id="contact">
        <h2 class="section-title">Contact</h2>
        <p class="section-lead">
            This section closes the presentation page and explains the purpose of the current prototype.
        </p>

        <div class="contact-grid">
            <article class="contact-card">
                <img class="contact-image" src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80" alt="Healthcare team meeting">
                <div class="contact-body">
                    <h3>Client and Coordination</h3>
                    <p>Client: David Alejandro Flores Villalva</p>
                    <p>Email: sersalud.team@clinic-demo.com</p>
                    <p>Phone: +593 04 555 0101</p>
                </div>
            </article>

            <article class="contact-card">
                <img class="contact-image" src="https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&w=1200&q=80" alt="Clinic front desk and computer">
                <div class="contact-body">
                    <h3>Project Purpose</h3>
                    <p>This website is a visual explanation of what the SER SALUD system can do in its current prototype stage.</p>
                    <p>More modules can be incorporated later as the project continues to grow.</p>
                </div>
            </article>
        </div>
    </section>

    <footer class="main-footer">
        <p>&copy; 2026 SER SALUD. All rights reserved.</p>
        <p>HTML - DevTeam</p>
        <p>Comprehensive Rehabilitation</p>
    </footer>
</body>
</html>