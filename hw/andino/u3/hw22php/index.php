<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>University Directory David - HW25</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <header class="top-bar">
        <div class="container">
            <h1>University Directory David - HW25</h1>
            <p class="subtitle" id="subtitle">Loading…</p>
        </div>
    </header>

    <main class="container">
        <section class="filters">
            <div class="filter-group">
                <label for="countryFilter">Country</label>
                <select id="countryFilter">
                    <option value="">All Countries</option>
                </select>
            </div>
            <div class="filter-group">
                <label for="search">Search</label>
                <input type="text" id="search" placeholder="Name, domain, or country…">
            </div>
            <div class="filter-group stats">
                <span id="resultCount">0 results</span>
            </div>
        </section>

        <div class="table-wrapper">
            <table id="universitiesTable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Country</th>
                        <th>Domain</th>
                        <th>Website</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>

        <div class="loading" id="loading">Loading university data…</div>

        <nav class="pagination" id="pagination"></nav>

        <div class="no-results" id="noResults">No universities match your filters.</div>
    </main>

    <script src="functions.js"></script>
</body>
</html>
