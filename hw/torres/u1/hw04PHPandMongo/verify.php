<?php
declare(strict_types=1);

require_once __DIR__ . '/db-config.php';

AppConfig::load();

$checks = [];

$checks[] = [
    'label' => 'PHP 8.1 or higher',
    'ok' => version_compare(PHP_VERSION, '8.1', '>='),
    'detail' => 'Detected version: ' . PHP_VERSION,
];

$checks[] = [
    'label' => 'MongoDB extension',
    'ok' => extension_loaded('mongodb'),
    'detail' => extension_loaded('mongodb')
        ? 'The native MongoDB extension is loaded.'
        : 'The mongodb extension is not enabled in PHP.',
];

$checks[] = [
    'label' => 'Environment file',
    'ok' => is_file(__DIR__ . '/.env'),
    'detail' => is_file(__DIR__ . '/.env')
        ? 'A `.env` file was found in the project root.'
        : 'No `.env` file was found. Default values will be used.',
];

$checks[] = [
    'label' => 'Core files',
    'ok' => is_file(__DIR__ . '/index.php') && is_file(__DIR__ . '/crud-operations.php') && is_file(__DIR__ . '/styles.css'),
    'detail' => 'index.php, crud-operations.php, and styles.css should all be present.',
];

$mongoStatus = [
    'ok' => false,
    'message' => 'The connection test could not be completed.',
    'stats' => null,
];

try {
    $connection = MongoDBConnection::getInstance();
    $crud = new StudentCRUD();
    $mongoStatus['ok'] = $connection->ping();
    $mongoStatus['message'] = $mongoStatus['ok']
        ? 'Connected successfully to ' . $connection->getNamespace()
        : 'MongoDB responded, but the ping command did not return OK.';
    $mongoStatus['stats'] = $crud->getStats();
} catch (Throwable $exception) {
    $mongoStatus['message'] = $exception->getMessage();
}

$checks[] = [
    'label' => 'MongoDB connection',
    'ok' => $mongoStatus['ok'],
    'detail' => $mongoStatus['message'],
];

$uri = AppConfig::env('MONGODB_URI', 'mongodb://127.0.0.1:27017') ?? 'mongodb://127.0.0.1:27017';
$maskedUri = preg_replace('/\/\/([^:\/]+):([^@]+)@/', '//$1:********@', $uri) ?? $uri;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project verification</title>
    <style>
        :root {
            --bg: #f4f7fb;
            --panel: #ffffff;
            --ink: #0f172a;
            --muted: #64748b;
            --ok: #15803d;
            --bad: #b91c1c;
        }

        * { box-sizing: border-box; }

        body {
            margin: 0;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            color: var(--ink);
            background:
                radial-gradient(circle at top left, rgba(29, 78, 216, 0.08), transparent 24%),
                radial-gradient(circle at top right, rgba(21, 128, 61, 0.08), transparent 20%),
                var(--bg);
        }

        .wrap {
            width: min(980px, calc(100% - 28px));
            margin: 0 auto;
            padding: 28px 0 40px;
        }

        .hero, .card {
            background: var(--panel);
            border-radius: 24px;
            box-shadow: 0 20px 48px rgba(15, 23, 42, 0.08);
            padding: 24px;
        }

        .hero {
            margin-bottom: 20px;
            background: linear-gradient(135deg, #0f766e, #2563eb);
            color: #fff;
        }

        .hero p { opacity: 0.9; max-width: 64ch; }
        h1, h2 { margin: 0 0 10px; }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 16px;
        }

        .check {
            padding: 18px;
            border-radius: 18px;
            background: #f8fafc;
            border: 1px solid rgba(15, 23, 42, 0.08);
        }

        .check.ok { border-color: rgba(21, 128, 61, 0.2); }
        .check.bad { border-color: rgba(185, 28, 28, 0.2); }

        .status {
            display: inline-block;
            margin-bottom: 8px;
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 0.82rem;
            font-weight: 700;
        }

        .ok .status { color: var(--ok); background: rgba(21, 128, 61, 0.12); }
        .bad .status { color: var(--bad); background: rgba(185, 28, 28, 0.12); }

        .card + .card { margin-top: 18px; }
        .meta { color: var(--muted); line-height: 1.6; }
        code {
            font-family: Consolas, "Courier New", monospace;
            background: rgba(15, 23, 42, 0.06);
            padding: 2px 6px;
            border-radius: 8px;
        }

        .stats {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
            margin-top: 12px;
        }

        .stats strong {
            display: block;
            font-size: 1.4rem;
        }
    </style>
</head>
<body>
    <div class="wrap">
        <section class="hero">
            <h1>Project verification</h1>
            <p>
                This page confirms that PHP, the MongoDB driver, and the configured connection
                for <code><?= htmlspecialchars($maskedUri, ENT_QUOTES, 'UTF-8') ?></code> are ready to use.
            </p>
        </section>

        <section class="card">
            <h2>Technical checklist</h2>
            <div class="grid">
                <?php foreach ($checks as $check): ?>
                    <article class="check <?= $check['ok'] ? 'ok' : 'bad' ?>">
                        <span class="status"><?= $check['ok'] ? 'OK' : 'Review' ?></span>
                        <h3><?= htmlspecialchars($check['label'], ENT_QUOTES, 'UTF-8') ?></h3>
                        <p class="meta"><?= htmlspecialchars($check['detail'], ENT_QUOTES, 'UTF-8') ?></p>
                    </article>
                <?php endforeach; ?>
            </div>
        </section>

        <?php if (is_array($mongoStatus['stats'])): ?>
            <section class="card">
                <h2>Current collection snapshot</h2>
                <div class="stats">
                    <div>
                        <span class="meta">Total records</span>
                        <strong><?= (int) $mongoStatus['stats']['total_students'] ?></strong>
                    </div>
                    <div>
                        <span class="meta">Programming languages in use</span>
                        <strong><?= (int) $mongoStatus['stats']['languages_used'] ?></strong>
                    </div>
                </div>
            </section>
        <?php endif; ?>
    </div>
</body>
</html>
