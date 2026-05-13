<?php

namespace App\Controller;

use App\Model\Truck;

class TruckController
{
    public function index(): void
    {
        $trucks = Truck::findAll();
        $this->json([
            'count'  => count($trucks),
            'trucks' => array_map(fn($t) => $t->toArray(), $trucks),
        ]);
    }

    public function show(int $id): void
    {
        $truck = Truck::findById($id);
        if (!$truck) {
            $this->error(404, 'Truck not found');
            return;
        }
        $this->json($truck->toArray());
    }

    public function search(string $query): void
    {
        $query  = trim($query);
        $trucks = Truck::search($query);
        $this->json([
            'count'  => count($trucks),
            'query'  => $query,
            'trucks' => array_map(fn($t) => $t->toArray(), $trucks),
        ]);
    }

    public function store(array $input): void
    {
        if (empty($input)) {
            $this->error(400, 'Invalid JSON input');
            return;
        }

        $truck = new Truck($input);
        $errors = $truck->validate();

        if (!empty($errors)) {
            $this->error(422, 'Validation failed', $errors);
            return;
        }

        try {
            $id = $truck->save();
            $this->json([
                'message' => 'Truck created successfully',
                'truck'   => $truck->toArray(),
            ], 201);
        } catch (\PDOException $e) {
            if ($e->getCode() === '23505') {
                $this->error(409, 'A truck with this license plate already exists');
            } else {
                throw $e;
            }
        }
    }

    private function json(array $data, int $status = 200): void
    {
        http_response_code($status);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    private function error(int $status, string $message, array $details = []): void
    {
        $payload = ['error' => $message];
        if (!empty($details)) {
            $payload['details'] = $details;
        }
        $this->json($payload, $status);
    }
}
