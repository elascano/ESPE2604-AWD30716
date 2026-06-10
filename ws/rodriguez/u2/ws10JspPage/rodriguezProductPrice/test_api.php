<?php
$url = 'https://tmjxgxiwmqfvavjnbdyj.supabase.co/rest/v1/products?select=*';
$key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtanhneGl3bXFmdmF2am5iZHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2Nzg5MDQsImV4cCI6MjA5MzI1NDkwNH0.QHB2iD2fnfklb21bhS0OX8mctt9lExQMgCboz5p_UmM';
$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ['apikey: ' . $key, 'Authorization: Bearer ' . $key],
]);
$res  = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo $code . ' -> ' . $res;
