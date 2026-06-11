<?php

namespace Config;

use RuntimeException;

class SupabaseClient
{
    private static ?self $instance = null;
    private string $baseUrl;
    private string $anonKey;

    private function __construct()
    {
        $this->baseUrl = rtrim($_ENV['SUPABASE_URL'], '/') . '/rest/v1';
        $this->anonKey = $_ENV['SUPABASE_ANON_KEY'];
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function get(string $table, array $params = []): array
    {
        $query = http_build_query(array_merge(['select' => '*'], $params));
        $url   = $this->baseUrl . '/' . $table . '?' . $query;
        return $this->request('GET', $url);
    }

    public function insert(string $table, array $data): array
    {
        $url = $this->baseUrl . '/' . $table;
        return $this->request('POST', $url, $data);
    }

    private function request(string $method, string $url, array $body = []): array
    {
        $ch = curl_init();

        $headers = [
            'apikey: '       . $this->anonKey,
            'Authorization: Bearer ' . $this->anonKey,
            'Content-Type: application/json',
            'Prefer: return=representation',
        ];

        curl_setopt_array($ch, [
            CURLOPT_URL            => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => $headers,
            CURLOPT_CUSTOMREQUEST  => $method,
        ]);

        if ($method === 'POST' && !empty($body)) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($response === false || $httpCode >= 400) {
            throw new RuntimeException('Supabase API error (' . $httpCode . '): ' . $response);
        }

        return json_decode($response, true) ?? [];
    }
}
