<?php
header('Content-Type: application/json');
header('Cache-Control: public, max-age=1800');
header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 1800) . ' GMT');

$cacheFile = __DIR__ . '/cache.json';
$ttl = 3600; // 1 hour

if (is_file($cacheFile) && (time() - filemtime($cacheFile) < $ttl)) {
    $mapped = json_decode(file_get_contents($cacheFile), true);
    if ($mapped !== null) {
        header('X-Cache: HIT');
        echo json_encode($mapped);
        exit;
    }
}

$url = "http://universities.hipolabs.com/search";
$response = @file_get_contents($url);
$universities = [];

if ($response !== false) {
    $data = json_decode($response, true);
    if (is_array($data)) {
        $universities = array_values(array_filter($data, fn($u) => !empty($u['country'])));
    }
}

usort($universities, function ($a, $b) {
    return strcmp($a['country'], $b['country']) ?: strcmp($a['name'] ?? '', $b['name'] ?? '');
});

$mapped = array_map(function ($u) {
    return [
        'name'    => $u['name'],
        'country' => $u['country'],
        'domain'  => $u['domains'][0] ?? '-',
        'web'     => $u['web_pages'][0] ?? '',
    ];
}, $universities);

file_put_contents($cacheFile, json_encode($mapped), LOCK_EX);
header('X-Cache: MISS');

echo json_encode($mapped);
