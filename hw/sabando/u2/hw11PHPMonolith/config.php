<?php

define('SUPABASE_URL', getenv('SUPABASE_URL') ?: '');
define('SUPABASE_KEY', getenv('SUPABASE_KEY') ?: '');

if (empty(SUPABASE_URL) || empty(SUPABASE_KEY)) {
    error_log("Advertencia: Las credenciales de Supabase no están configuradas en las variables de entorno.");
}

function supabase_request($endpoint, $method = 'GET', $data = null) {
    $ch = curl_init(SUPABASE_URL . '/rest/v1/' . $endpoint);
    
    $headers = [
        'apikey: ' . SUPABASE_KEY,
        'Authorization: Bearer ' . SUPABASE_KEY,
        'Content-Type: application/json',
        'Prefer: return=representation'
    ];
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    
    if ($data) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}