<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Engine Feature</title>
    <link rel="stylesheet" href="../../css/styles.css">
    <link rel="icon" href="https://res.cloudinary.com/dyqrc7mxj/image/upload/v1777267507/SerSaludVinietaPNG_ho0saz.png" type="image/png">
</head>
<body>
    <nav class="navbar">
        <a href="../../../index.php" class="logo"><img src="https://res.cloudinary.com/dyqrc7mxj/image/upload/v1777267506/SerSaludGrandePNG_yvat7q.png" class="logo-img"></a>
        <ul class="nav-links">
            <li><a href="../../../index.php#home">Home</a></li>
            <li><a href="../../../index.php#features">Features</a></li>
            <li><a href="../../../index.php#contact">Contact</a></li>
        </ul>
    </nav>

    <section class="page-hero">
        <div>
            <span class="eyebrow">Appointment Module</span>
            <h1>Appointment scheduling overview</h1>
            <p>This page explains the current scheduling prototype and how appointments can be organized in a simple way for the clinic.</p>
            <div class="hero-actions">
                <a href="appointment_form.php" class="btn-primary">Book Session</a>
                <a href="appointment_table.php" class="btn-secondary">View Agenda</a>
            </div>
        </div>
        <img class="page-hero-image" src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80">
    </section>

    <section class="content-section">
        <div class="content-panel">
            <h2>Booking Workflow Overview</h2>
            <p>In the current prototype, the appointment section focuses on selecting a patient, choosing a therapy area, and assigning a date to the session.</p>
            <ul>
                <li>The form allows basic booking by patient DNI.</li>
                <li>The therapy area can be selected from the available options in the prototype.</li>
                <li>The agenda page helps review scheduled appointments in a simple table.</li>
            </ul>
        </div>
        <div class="options-grid">
            <article class="option-card">
                <img class="option-image" src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80">
                <div class="option-body">
                    <span class="option-tag">Current Option</span>
                    <h3>Schedule Appointment</h3>
                    <p>Show how a patient session can be created using DNI, therapy area, and appointment date.</p>
                    <a href="appointment_form.php" class="btn-primary">Open Scheduler</a>
                </div>
            </article>
            <article class="option-card">
                <img class="option-image" src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80">
                <div class="option-body">
                    <span class="option-tag">Current Option</span>
                    <h3>Therapy Selection</h3>
                    <p>Present the available therapy categories inside the form so the appointment has a defined treatment area.</p>
                    <a href="appointment_table.php" class="btn-secondary">See Agenda</a>
                </div>
            </article>
            <article class="option-card">
                <img class="option-image" src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80">
                <div class="option-body">
                    <span class="option-tag">Current Option</span>
                    <h3>Agenda Table</h3>
                    <p>Display the registered appointments in a clear table so the clinic can review upcoming sessions.</p>
                    <a href="appointment_form.php" class="btn-secondary">Try Booking</a>
                </div>
            </article>
        </div>
    </section>
</body>
</html>