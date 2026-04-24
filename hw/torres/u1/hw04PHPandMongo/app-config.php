<?php
declare(strict_types=1);

final class AppConfig
{
    private static bool $loaded = false;

    /**
     * @var array<string, string>
     */
    private static array $values = [];

    public static function load(): void
    {
        if (self::$loaded) {
            return;
        }

        self::$loaded = true;

        $files = [
            __DIR__ . DIRECTORY_SEPARATOR . '.env',
            __DIR__ . DIRECTORY_SEPARATOR . '.env.local',
        ];

        foreach ($files as $file) {
            if (!is_file($file)) {
                continue;
            }

            $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            if ($lines === false) {
                continue;
            }

            foreach ($lines as $line) {
                $line = trim($line);

                if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
                    continue;
                }

                [$name, $value] = explode('=', $line, 2);
                $name = trim($name);
                $value = self::normalizeValue($value);

                if ($name === '') {
                    continue;
                }

                self::$values[$name] = $value;
                $_ENV[$name] = $value;
                putenv(sprintf('%s=%s', $name, $value));
            }
        }
    }

    public static function env(string $key, ?string $default = null): ?string
    {
        self::load();

        $value = self::$values[$key] ?? $_ENV[$key] ?? getenv($key);

        if ($value === false || $value === null || $value === '') {
            return $default;
        }

        return (string) $value;
    }

    public static function envBool(string $key, bool $default = false): bool
    {
        $value = self::env($key);

        if ($value === null) {
            return $default;
        }

        return in_array(strtolower($value), ['1', 'true', 'yes', 'on'], true);
    }

    private static function normalizeValue(string $value): string
    {
        $value = trim($value);

        if (
            (str_starts_with($value, '"') && str_ends_with($value, '"')) ||
            (str_starts_with($value, "'") && str_ends_with($value, "'"))
        ) {
            $value = substr($value, 1, -1);
        }

        return trim($value);
    }
}
