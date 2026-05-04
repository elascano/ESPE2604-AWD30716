<?php

$data = json_decode(file_get_contents("php://input"), true);


// 🔑 CONFIGURACIÓN SUPABASE
$urlBase = "https://aokspgkcmwopqapytejd.supabase.co/rest/v1/customers";
$apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFva3NwZ2tjbXdvcHFhcHl0ZWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NzMxMDAsImV4cCI6MjA5MzM0OTEwMH0.xFwKepbjISQhv2j6fzjbolVlCwr9UaH6S96mQCOUHfs";

// 🆔 ID del registro a eliminar
$id = $data["id"];

// 🔗 URL con filtro
$url = $urlBase . "?id=eq." . $id;

// 📡 PETICIÓN HTTP (DELETE)
$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");

curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "apikey: $apiKey",
    "Authorization: Bearer $apiKey",
    "Prefer: return=minimal"
]);

$response = curl_exec($ch);
curl_close($ch);

// RESPUESTA
echo json_encode(["status" => "deleted"]);
