<?php
declare(strict_types=1);

$root = dirname(__DIR__);
$paths = [
    dirname($root) . '/Model',
    $root . '/public',
    $root . '/routes',
    $root . '/src',
    $root . '/tests',
];

$failures = [];

foreach ($paths as $path) {
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path));

    foreach ($iterator as $file) {
        if (!$file->isFile() || $file->getExtension() !== 'php') {
            continue;
        }

        $command = escapeshellarg(PHP_BINARY) . ' -l ' . escapeshellarg($file->getPathname());
        exec($command, $output, $exitCode);

        if ($exitCode !== 0) {
            $failures[] = $file->getPathname();
            echo implode(PHP_EOL, $output) . PHP_EOL;
        }
    }
}

if ($failures !== []) {
    fwrite(STDERR, 'Lint failed for ' . count($failures) . ' file(s).' . PHP_EOL);
    exit(1);
}

echo 'PHP lint passed.' . PHP_EOL;
