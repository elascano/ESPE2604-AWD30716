<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Staff Directory Feature</title>
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
            <span class="eyebrow">Specialist Module</span>
            <h1>Specialist information and service presentation</h1>
            <p>This page explains how the prototype presents the clinic team and the professional information patients may want to review.</p>
            <div class="hero-actions">
                <a href="specialist_form.php" class="btn-primary">Add Specialist</a>
                <a href="specialist_table.php" class="btn-secondary">View Staff Roster</a>
            </div>
        </div>
        <img class="page-hero-image" src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80">
    </section>

    <section class="content-section">
        <div class="content-panel">
            <h2>What This Module Shows</h2>
            <p>In the current prototype, this section focuses on the specialist roster, each professional's specialty, and the way clinic services can be communicated through the website.</p>
            <ul>
                <li>The prototype includes a form to register a specialist.</li>
                <li>The roster table displays names and specialties in an organized way.</li>
                <li>This section also helps explain the services the clinic wants to highlight.</li>
            </ul>
        </div>
        <div class="options-grid">
            <article class="option-card">
                <img class="option-image" src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80">
                <div class="option-body">
                    <span class="option-tag">Current Option</span>
                    <h3>Specialist Registration</h3>
                    <p>Show how the clinic can register a professional with name and main specialty in the prototype.</p>
                    <a href="specialist_form.php" class="btn-primary">Add Specialist</a>
                </div>
            </article>
            <article class="option-card">
                <img class="option-image" src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80">
                <div class="option-body">
                    <span class="option-tag">Current Option</span>
                    <h3>Services and Specialties</h3>
                    <p>Explain the treatment areas and specialties the clinic wants to communicate through the website.</p>
                    <a href="../../../index.php#features" class="btn-secondary">View Services</a>
                </div>
            </article>
            <article class="option-card">
                <img class="option-image" src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80">
                <div class="option-body">
                    <span class="option-tag">Current Option</span>
                    <h3>Specialist Roster</h3>
                    <p>Present the registered team in a simple table so visitors can understand who is part of the clinic staff.</p>
                    <a href="specialist_table.php" class="btn-primary">See Specialists</a>
                </div>
            </article>
        </div>
    </section>
</body>
</html>