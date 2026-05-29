<?php
require_once __DIR__ . '/google-client.php';

header('Location: ' . $client->createAuthUrl());
exit();
