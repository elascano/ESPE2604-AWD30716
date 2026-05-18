<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Truck extends Model
{
    protected $table = 'trucks';
    public $timestamps = false;

    protected $fillable = [
        'license_plate',
        'brand',
        'model',
        'year',
        'capacity_tons',
        'fuel_type',
        'driver_name',
        'last_maintenance_date',
        'status',
    ];

    protected $casts = [
        'year'          => 'integer',
        'capacity_tons' => 'float',
    ];

    protected $appends = ['maintenance_status'];

    private const VALID_FUEL_TYPES = ['Diesel', 'Gasoline', 'Electric', 'CNG', 'Hybrid'];
    private const VALID_STATUSES   = ['Active', 'In Maintenance', 'Inactive'];

    public function getMaintenanceStatusAttribute(): string
    {
        $lastMaint = new \DateTime($this->last_maintenance_date);
        $now       = new \DateTime();
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

    public static function search(string $query): array
    {
        $like = "%$query%";

        return self::where('license_plate', 'ILIKE', $like)
            ->orWhere('brand', 'ILIKE', $like)
            ->orWhere('model', 'ILIKE', $like)
            ->orWhere('driver_name', 'ILIKE', $like)
            ->orWhere('fuel_type', 'ILIKE', $like)
            ->orWhereRaw('CAST(year AS TEXT) ILIKE ?', [$like])
            ->orWhere('status', 'ILIKE', $like)
            ->orderBy('id', 'desc')
            ->get()
            ->all();
    }
}
