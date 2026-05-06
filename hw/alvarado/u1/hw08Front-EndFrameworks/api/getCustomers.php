<?php

header("Content-Type: application/json");

// 🔑 CONFIGURACIÓN SUPABASE
$url = "https://aokspgkcmwopqapytejd.supabase.co/rest/v1/customers?select=*";
$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFva3NwZ2tjbXdvcHFhcHl0ZWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NzMxMDAsImV4cCI6MjA5MzM0OTEwMH0.xFwKepbjISQhv2j6fzjbolVlCwr9UaH6S96mQCOUHfs";

// 📡 PETICIÓN HTTP (GET)
$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "apikey: $apiKey",
    "Authorization: Bearer $apiKey",
    "Content-Type: application/json"
]);

$response = curl_exec($ch);
curl_close($ch);

// 🔄 Devolver directamente lo que responde Supabase
echo $response;