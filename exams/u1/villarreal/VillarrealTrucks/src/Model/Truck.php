<?php

namespace App\Model;

use App\Database;
use DateTime;

class Truck
{
    private ?int $id = null;
    private string $license_plate;
    private string $brand;
    private string $model;
    private int $year;
    private float $capacity_tons;
    private string $fuel_type;
    private string $driver_name;
    private string $last_maintenance_date;
    private string $status = 'Active';
    private ?string $created_at = null;

    private const VALID_FUEL_TYPES = ['Diesel', 'Gasoline', 'Electric', 'CNG', 'Hybrid'];
    private const VALID_STATUSES   = ['Active', 'In Maintenance', 'Inactive'];

    public function __construct(array $data = [])
    {
        if (!empty($data)) {
            $this->hydrate($data);
        }
    }

    public function hydrate(array $data): void
    {
        foreach ($data as $key => $value) {
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }
    }

    public function toArray(): array
    {
        return [
            'id'                    => (int) $this->id,
            'license_plate'         => $this->license_plate,
            'brand'                 => $this->brand,
            'model'                 => $this->model,
            'year'                  => $this->year,
            'capacity_tons'         => (float) $this->capacity_tons,
            'fuel_type'             => $this->fuel_type,
            'driver_name'           => $this->driver_name,
            'last_maintenance_date' => $this->last_maintenance_date,
            'status'                => $this->status,
            'created_at'            => $this->created_at,
            'maintenance_status'    => $this->computeMaintenanceStatus(),
        ];
    }

    public function computeMaintenanceStatus(): string
    {
        $lastMaint = new DateTime($this->last_maintenance_date);
        $now       = new DateTime();
        $daysSince = (int) $lastMaint->diff($now)->days;

        if ($daysSince > 365) {
            return 'Overdue';
        }
        if ($daysSince > 180) {
            return 'Due Soon';
        }
        return 'Up to Date';
    }

    public function validate(): array
    {
        $errors = [];

        if (empty($this->license_plate)) {
            $errors[] = 'License plate is required.';
        }
        if (empty($this->brand)) {
            $errors[] = 'Brand is required.';
        }
        if (empty($this->model)) {
            $errors[] = 'Model is required.';
        }
        if (empty($this->year) || $this->year < 1990 || $this->year > 2030) {
            $errors[] = 'Year must be between 1990 and 2030.';
        }
        if (empty($this->capacity_tons) || $this->capacity_tons <= 0) {
            $errors[] = 'Capacity must be greater than 0.';
        }
        if (!in_array($this->fuel_type, self::VALID_FUEL_TYPES, true)) {
            $errors[] = 'Fuel type must be: ' . implode(', ', self::VALID_FUEL_TYPES);
        }
        if (empty($this->driver_name)) {
            $errors[] = 'Driver name is required.';
        }
        if (empty($this->last_maintenance_date)) {
            $errors[] = 'Last maintenance date is required.';
        }
        if (!in_array($this->status, self::VALID_STATUSES, true)) {
            $errors[] = 'Status must be: ' . implode(', ', self::VALID_STATUSES);
        }

        return $errors;
    }

    public function save(): ?int
    {
        $db  = Database::getConnection();
        $sql = 'INSERT INTO trucks (license_plate, brand, model, year, capacity_tons, fuel_type, driver_name, last_maintenance_date, status)
                VALUES (:lp, :brand, :model, :year, :cap, :fuel, :driver, :maint, :status)
                RETURNING id';

        $stmt = $db->prepare($sql);
        $stmt->execute([
            ':lp'     => $this->license_plate,
            ':brand'  => $this->brand,
            ':model'  => $this->model,
            ':year'   => $this->year,
            ':cap'    => $this->capacity_tons,
            ':fuel'   => $this->fuel_type,
            ':driver' => $this->driver_name,
            ':maint'  => $this->last_maintenance_date,
            ':status' => $this->status,
        ]);

        $this->id = (int) $stmt->fetchColumn();
        return $this->id;
    }

    public static function findById(int $id): ?self
    {
        $db   = Database::getConnection();
        $stmt = $db->prepare('SELECT * FROM trucks WHERE id = :id');
        $stmt->execute([':id' => $id]);

        return ($row = $stmt->fetch()) ? new self($row) : null;
    }

    public static function search(string $query): array
    {
        $db   = Database::getConnection();
        $sql  = 'SELECT * FROM trucks WHERE
                    license_plate ILIKE :q OR
                    brand ILIKE :q OR
                    model ILIKE :q OR
                    driver_name ILIKE :q OR
                    fuel_type ILIKE :q OR
                    CAST(year AS TEXT) ILIKE :q OR
                    status ILIKE :q
                 ORDER BY id DESC';
        $stmt = $db->prepare($sql);
        $stmt->execute([':q' => "%$query%"]);

        return array_map(fn($row) => new self($row), $stmt->fetchAll());
    }

    public static function findAll(): array
    {
        $db   = Database::getConnection();
        $stmt = $db->query('SELECT * FROM trucks ORDER BY id DESC');

        return array_map(fn($row) => new self($row), $stmt->fetchAll());
    }

    public static function count(): int
    {
        $db   = Database::getConnection();
        $stmt = $db->query('SELECT COUNT(*) FROM trucks');
        return (int) $stmt->fetchColumn();
    }
}
