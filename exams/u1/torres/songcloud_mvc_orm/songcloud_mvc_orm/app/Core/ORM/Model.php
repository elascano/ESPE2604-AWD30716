<?php

declare(strict_types=1);

namespace App\Core\ORM;

use App\Core\Database;
use PDO;

abstract class Model
{
    protected static string $table;
    protected static string $primaryKey = 'id';
    protected static array $fillable = [];

    protected array $attributes = [];

    public function __construct(array $attributes = [])
    {
        $this->attributes = $attributes;
    }

    public function __get(string $key): mixed
    {
        return $this->attributes[$key] ?? null;
    }

    public function __set(string $key, mixed $value): void
    {
        $this->attributes[$key] = $value;
    }

    public function toArray(): array
    {
        return $this->attributes;
    }

    protected static function db(): PDO
    {
        return Database::connection();
    }

    public static function all(string $orderBy = 'id DESC'): array
    {
        $sql = 'SELECT * FROM ' . static::$table . ' ORDER BY ' . self::safeOrderBy($orderBy);
        $statement = static::db()->query($sql);
        return array_map(fn (array $row) => new static($row), $statement->fetchAll());
    }

    public static function find(int $id): ?static
    {
        $sql = 'SELECT * FROM ' . static::$table . ' WHERE ' . static::$primaryKey . ' = :id LIMIT 1';
        $statement = static::db()->prepare($sql);
        $statement->execute(['id' => $id]);
        $row = $statement->fetch();
        return $row ? new static($row) : null;
    }

    public static function whereLike(array $columns, string $term, string $orderBy = 'id DESC'): array
    {
        $term = '%' . trim($term) . '%';
        $conditions = [];
        $params = [];

        foreach ($columns as $index => $column) {
            $safeColumn = self::safeIdentifier($column);
            $param = 'term_' . $index;
            $conditions[] = $safeColumn . ' LIKE :' . $param;
            $params[$param] = $term;
        }

        $sql = 'SELECT * FROM ' . static::$table . ' WHERE ' . implode(' OR ', $conditions)
            . ' ORDER BY ' . self::safeOrderBy($orderBy);

        $statement = static::db()->prepare($sql);
        $statement->execute($params);

        return array_map(fn (array $row) => new static($row), $statement->fetchAll());
    }

    public static function create(array $data): static
    {
        $data = static::onlyFillable($data);
        $data['created_at'] = date('Y-m-d H:i:s');
        $data['updated_at'] = date('Y-m-d H:i:s');

        $columns = array_keys($data);
        $placeholders = array_map(fn (string $column) => ':' . $column, $columns);

        $sql = 'INSERT INTO ' . static::$table
            . ' (' . implode(', ', $columns) . ') VALUES (' . implode(', ', $placeholders) . ')';

        $statement = static::db()->prepare($sql);
        $statement->execute($data);

        $id = (int) static::db()->lastInsertId();
        return static::find($id);
    }

    public static function updateById(int $id, array $data): bool
    {
        $data = static::onlyFillable($data);
        $data['updated_at'] = date('Y-m-d H:i:s');

        $sets = [];
        foreach (array_keys($data) as $column) {
            $sets[] = $column . ' = :' . $column;
        }

        $data['id'] = $id;
        $sql = 'UPDATE ' . static::$table . ' SET ' . implode(', ', $sets)
            . ' WHERE ' . static::$primaryKey . ' = :id';

        $statement = static::db()->prepare($sql);
        return $statement->execute($data);
    }

    public static function deleteById(int $id): bool
    {
        $sql = 'DELETE FROM ' . static::$table . ' WHERE ' . static::$primaryKey . ' = :id';
        $statement = static::db()->prepare($sql);
        return $statement->execute(['id' => $id]);
    }

    protected static function onlyFillable(array $data): array
    {
        return array_intersect_key($data, array_flip(static::$fillable));
    }

    private static function safeIdentifier(string $identifier): string
    {
        if (!preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $identifier)) {
            throw new \InvalidArgumentException('Identificador SQL no permitido.');
        }

        return $identifier;
    }

    private static function safeOrderBy(string $orderBy): string
    {
        if (!preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*(\s+(ASC|DESC))?$/i', trim($orderBy))) {
            return static::$primaryKey . ' DESC';
        }

        return $orderBy;
    }
}
