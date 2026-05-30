<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= htmlspecialchars($title ?? 'Employees', ENT_QUOTES, 'UTF-8') ?></title>
    <link rel="stylesheet" href="/assets/styles.css">
    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js" defer></script>
</head>
<body>
<header class="topbar">
    <a class="brand" href="/employees">Employees</a>
    <nav class="nav">
        <a href="/employees">Table</a>
        <a href="/employees/create">New</a>
    </nav>
</header>
<main class="page">
