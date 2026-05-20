<?php

namespace App\Models;

use Config\SupabaseClient;

abstract class BaseModel
{
    protected static string $table    = '';
    protected static array  $fillable = [];
    protected array          $attributes = [];

    public function __construct(array $attributes = [])
    {
        $this->attributes = $attributes;
    }

    public function __get(string $key): mixed
    {
        return $this->attributes[$key] ?? null;
    }

    public static function all(): array
    {
        $rows = SupabaseClient::getInstance()->get(
            static::$table,
            ['order' => 'created_at.desc']
        );

        return array_map(fn(array $row) => new static($row), $rows);
    }

    public static function create(array $data): static
    {
        $filtered = array_intersect_key($data, array_flip(static::$fillable));
        $result   = SupabaseClient::getInstance()->insert(static::$table, $filtered);

        return new static($result[0] ?? $filtered);
    }

    public static function sum(string $column): float
    {
        $rows = SupabaseClient::getInstance()->get(static::$table, ['select' => $column]);

        return array_reduce(
            $rows,
            fn(float $carry, array $row) => $carry + (float) ($row[$column] ?? 0),
            0.0
        );
    }
}
