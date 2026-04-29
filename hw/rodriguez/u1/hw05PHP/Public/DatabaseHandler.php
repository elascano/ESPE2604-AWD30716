<?php

class DatabaseHandler {
    private PDO $connection;

    public function __construct(string $host, string $db, string $user, string $pass, string $port = '5432') {
        $dsn = "pgsql:host=$host;port=$port;dbname=$db";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        $this->connection = new PDO($dsn, $user, $pass, $options);
    }

    public function create(string $table, array $data): bool {
        $columns = implode(', ', array_keys($data));
        $placeholders = implode(', ', array_map(fn($key) => ":$key", array_keys($data)));
        $sql = "INSERT INTO $table ($columns) VALUES ($placeholders)";
        $stmt = $this->connection->prepare($sql);
        return $stmt->execute($data);
    }

    public function read(string $table, array $conditions = []): array {
        $sql = "SELECT * FROM $table";
        if (!empty($conditions)) {
            $clause = implode(' AND ', array_map(fn($key) => "$key = :$key", array_keys($conditions)));
            $sql .= " WHERE $clause";
        }
        $stmt = $this->connection->prepare($sql);
        $stmt->execute($conditions);
        return $stmt->fetchAll();
    }

    public function update(string $table, array $data, array $conditions): bool {
        $setClause = implode(', ', array_map(fn($key) => "$key = :set_$key", array_keys($data)));
        $whereClause = implode(' AND ', array_map(fn($key) => "$key = :where_$key", array_keys($conditions)));
        
        $sql = "UPDATE $table SET $setClause WHERE $whereClause";
        $stmt = $this->connection->prepare($sql);
        
        $params = [];
        foreach ($data as $key => $value) {
            $params["set_$key"] = $value;
        }
        foreach ($conditions as $key => $value) {
            $params["where_$key"] = $value;
        }
        
        return $stmt->execute($params);
    }

    public function delete(string $table, array $conditions): bool {
        $whereClause = implode(' AND ', array_map(fn($key) => "$key = :$key", array_keys($conditions)));
        $sql = "DELETE FROM $table WHERE $whereClause";
        $stmt = $this->connection->prepare($sql);
        return $stmt->execute($conditions);
    }
}
