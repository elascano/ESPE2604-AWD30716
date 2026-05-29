<?php
session_start();

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$scriptPath = $_SERVER['SCRIPT_NAME'] ?? '';
$basePath = rtrim(dirname(dirname(dirname($scriptPath))), '/');
if ($basePath === '/' || $basePath === '.') {
	$basePath = '';
}
$GLOBALS['APP_BASE_PATH'] = $basePath;

