<?php
declare(strict_types=1);

require_once __DIR__ . '/db-config.php';

use MongoDB\BSON\ObjectId;
use MongoDB\BSON\Regex;
use MongoDB\BSON\UTCDateTime;
use MongoDB\Driver\BulkWrite;
use MongoDB\Driver\Exception\BulkWriteException;
use MongoDB\Driver\Exception\Exception as MongoDriverException;
use MongoDB\Driver\Query;

final class StudentCRUD
{
    /**
     * @var string[]
     */
    private const MAJORS = [
        'Systems Engineering',
        'Software Engineering',
        'Civil Engineering',
        'Industrial Engineering',
        'Business Administration',
        'Accounting',
        'Law',
    ];

    /**
     * @var array<string, string>
     */
    private const MAJOR_ALIASES = [
        'systems engineering' => 'Systems Engineering',
        'software engineering' => 'Software Engineering',
        'civil engineering' => 'Civil Engineering',
        'industrial engineering' => 'Industrial Engineering',
        'business administration' => 'Business Administration',
        'accounting' => 'Accounting',
        'law' => 'Law',
        'ingenieria de sistemas' => 'Systems Engineering',
        'ingeniería de sistemas' => 'Systems Engineering',
        'ingenieria en software' => 'Software Engineering',
        'ingeniería en software' => 'Software Engineering',
        'ingenieria civil' => 'Civil Engineering',
        'ingeniería civil' => 'Civil Engineering',
        'ingenieria industrial' => 'Industrial Engineering',
        'ingeniería industrial' => 'Industrial Engineering',
        'administracion de empresas' => 'Business Administration',
        'administración de empresas' => 'Business Administration',
        'contabilidad' => 'Accounting',
        'derecho' => 'Law',
    ];

    /**
     * @var string[]
     */
    private const PROGRAMMING_LANGUAGES = [
        'Python',
        'Java',
        'JavaScript',
        'TypeScript',
        'C#',
        'C++',
        'PHP',
        'Go',
        'Ruby',
        'Swift',
        'Kotlin',
        'Rust',
    ];

    private MongoDBConnection $connection;
    private MongoDB\Driver\Manager $manager;
    private string $namespace;

    public function __construct()
    {
        $this->connection = MongoDBConnection::getInstance();
        $this->manager = $this->connection->getManager();
        $this->namespace = $this->connection->getNamespace();
    }

    /**
     * @return array<string, string>
     */
    public function getEmptyFormData(): array
    {
        return [
            'id' => '',
            'name' => '',
            'email' => '',
            'phone' => '',
            'career' => '',
            'favorite_language' => '',
        ];
    }

    /**
     * @return string[]
     */
    public function getMajors(): array
    {
        return self::MAJORS;
    }

    /**
     * @return string[]
     */
    public function getProgrammingLanguages(): array
    {
        return self::PROGRAMMING_LANGUAGES;
    }

    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    public function formDataFromInput(array $data): array
    {
        $clean = $this->normalizeInput($data);
        $clean['id'] = trim((string) ($data['id'] ?? ''));

        return $clean;
    }

    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    public function validate(array $data): array
    {
        return $this->validateAndNormalize($data)['errors'];
    }

    /**
     * @param array<string, mixed> $data
     * @return array<string, mixed>
     */
    public function create(array $data): array
    {
        $result = $this->validateAndNormalize($data);
        if ($result['errors'] !== []) {
            return [
                'success' => false,
                'errors' => $result['errors'],
            ];
        }

        $clean = $result['data'];

        try {
            if ($this->emailExists($clean['email'])) {
                return [
                    'success' => false,
                    'errors' => ['email' => 'This email address is already registered.'],
                ];
            }

            $bulk = new BulkWrite(['ordered' => true]);
            $insertedId = $bulk->insert([
                'name' => $clean['name'],
                'email' => $clean['email'],
                'phone' => $clean['phone'],
                'career' => $clean['career'],
                'favorite_language' => $clean['favorite_language'],
                'status' => 'active',
                'enrollment_date' => new UTCDateTime(),
                'updated_date' => new UTCDateTime(),
            ]);

            $this->manager->executeBulkWrite($this->namespace, $bulk);

            return [
                'success' => true,
                'message' => 'Record created successfully.',
                'id' => (string) $insertedId,
            ];
        } catch (BulkWriteException $exception) {
            if (str_contains(strtolower($exception->getMessage()), 'duplicate key')) {
                return [
                    'success' => false,
                    'errors' => ['email' => 'This email address is already registered.'],
                ];
            }

            return ['success' => false, 'error' => 'The record could not be created.'];
        } catch (MongoDriverException) {
            return ['success' => false, 'error' => 'The record could not be created.'];
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function readAll(): array
    {
        try {
            $documents = $this->findMany([], [
                'sort' => ['name' => 1, 'email' => 1],
            ]);

            return array_map(fn(object $document): array => $this->formatStudent($document), $documents);
        } catch (MongoDriverException) {
            return [];
        }
    }

    /**
     * @return array<string, mixed>|null
     */
    public function readById(string $id): ?array
    {
        if (!$this->isValidObjectId($id)) {
            return null;
        }

        try {
            $document = $this->findOne(['_id' => new ObjectId($id)]);

            return $document === null ? null : $this->formatStudent($document);
        } catch (MongoDriverException) {
            return null;
        }
    }

    /**
     * @param array<string, mixed> $data
     * @return array<string, mixed>
     */
    public function update(string $id, array $data): array
    {
        if (!$this->isValidObjectId($id)) {
            return ['success' => false, 'error' => 'The record ID is invalid.'];
        }

        $existing = $this->readById($id);
        if ($existing === null) {
            return ['success' => false, 'error' => 'The record you are trying to edit no longer exists.'];
        }

        $result = $this->validateAndNormalize($data);
        if ($result['errors'] !== []) {
            return [
                'success' => false,
                'errors' => $result['errors'],
            ];
        }

        $clean = $result['data'];

        try {
            if ($this->emailExists($clean['email'], $id)) {
                return [
                    'success' => false,
                    'errors' => ['email' => 'This email address is already registered.'],
                ];
            }

            $bulk = new BulkWrite(['ordered' => true]);
            $bulk->update(
                ['_id' => new ObjectId($id)],
                [
                    '$set' => [
                        'name' => $clean['name'],
                        'email' => $clean['email'],
                        'phone' => $clean['phone'],
                        'career' => $clean['career'],
                        'favorite_language' => $clean['favorite_language'],
                        'updated_date' => new UTCDateTime(),
                    ],
                    '$unset' => [
                        'gpa' => '',
                    ],
                ],
                ['multi' => false, 'upsert' => false]
            );

            $result = $this->manager->executeBulkWrite($this->namespace, $bulk);

            return [
                'success' => true,
                'message' => $result->getModifiedCount() > 0
                    ? 'Record updated successfully.'
                    : 'No changes were needed. The record was already up to date.',
            ];
        } catch (BulkWriteException $exception) {
            if (str_contains(strtolower($exception->getMessage()), 'duplicate key')) {
                return [
                    'success' => false,
                    'errors' => ['email' => 'This email address is already registered.'],
                ];
            }

            return ['success' => false, 'error' => 'The record could not be updated.'];
        } catch (MongoDriverException) {
            return ['success' => false, 'error' => 'The record could not be updated.'];
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function delete(string $id): array
    {
        if (!$this->isValidObjectId($id)) {
            return ['success' => false, 'error' => 'The record ID is invalid.'];
        }

        try {
            $bulk = new BulkWrite(['ordered' => true]);
            $bulk->delete(['_id' => new ObjectId($id)], ['limit' => 1]);
            $result = $this->manager->executeBulkWrite($this->namespace, $bulk);

            if ($result->getDeletedCount() === 0) {
                return ['success' => false, 'error' => 'The record no longer exists or was already removed.'];
            }

            return ['success' => true, 'message' => 'Record deleted successfully.'];
        } catch (MongoDriverException) {
            return ['success' => false, 'error' => 'The record could not be deleted.'];
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function search(string $query): array
    {
        $query = trim($query);
        if ($query === '') {
            return $this->readAll();
        }

        $safePattern = preg_quote($query, '/');
        $regex = new Regex($safePattern, 'i');

        try {
            $documents = $this->findMany([
                '$or' => [
                    ['name' => $regex],
                    ['email' => $regex],
                    ['phone' => $regex],
                    ['career' => $regex],
                    ['favorite_language' => $regex],
                ],
            ], [
                'sort' => ['name' => 1, 'email' => 1],
            ]);

            return array_map(fn(object $document): array => $this->formatStudent($document), $documents);
        } catch (MongoDriverException) {
            return [];
        }
    }

    /**
     * @return array<string, int|string>
     */
    public function getStats(): array
    {
        try {
            $documents = $this->findMany([], [
                'projection' => ['favorite_language' => 1],
            ]);

            $total = count($documents);
            $languagesUsed = [];

            foreach ($documents as $document) {
                $record = (array) $document;
                $language = trim((string) ($record['favorite_language'] ?? ''));

                if ($language !== '') {
                    $languagesUsed[$language] = true;
                }
            }

            return [
                'total_students' => $total,
                'languages_used' => count($languagesUsed),
            ];
        } catch (MongoDriverException) {
            return [
                'total_students' => 0,
                'languages_used' => 0,
            ];
        }
    }

    /**
     * @param array<string, mixed> $data
     * @return array{data: array<string, string>, errors: array<string, string>}
     */
    private function validateAndNormalize(array $data): array
    {
        $clean = $this->normalizeInput($data);
        $errors = [];

        if ($clean['name'] === '') {
            $errors['name'] = 'Full name is required.';
        } elseif (mb_strlen($clean['name']) < 2 || mb_strlen($clean['name']) > 120) {
            $errors['name'] = 'Full name must be between 2 and 120 characters.';
        } elseif (!preg_match("/^[\p{L}\p{M}\s'.-]+$/u", $clean['name'])) {
            $errors['name'] = 'Full name can only contain letters, spaces, apostrophes, periods, and hyphens.';
        }

        if ($clean['email'] === '') {
            $errors['email'] = 'Email address is required.';
        } elseif (!filter_var($clean['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Please enter a valid email address.';
        } elseif (mb_strlen($clean['email']) > 160) {
            $errors['email'] = 'Email address is too long.';
        }

        $digitsOnly = preg_replace('/\D+/', '', $clean['phone']) ?? '';
        if ($clean['phone'] === '') {
            $errors['phone'] = 'Phone number is required.';
        } elseif (!preg_match('/^\+?[0-9\s\-()]+$/', $clean['phone'])) {
            $errors['phone'] = 'Phone number can only include digits, spaces, parentheses, and hyphens.';
        } elseif (strlen($digitsOnly) < 7 || strlen($digitsOnly) > 15) {
            $errors['phone'] = 'Phone number must contain between 7 and 15 digits.';
        }

        if ($clean['career'] === '') {
            $errors['career'] = 'Please select a major.';
        } elseif (!in_array($clean['career'], self::MAJORS, true)) {
            $errors['career'] = 'The selected major is not valid.';
        }

        if ($clean['favorite_language'] === '') {
            $errors['favorite_language'] = 'Please select a favorite programming language.';
        } elseif (!in_array($clean['favorite_language'], self::PROGRAMMING_LANGUAGES, true)) {
            $errors['favorite_language'] = 'The selected programming language is not valid.';
        }

        return [
            'data' => $clean,
            'errors' => $errors,
        ];
    }

    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    private function normalizeInput(array $data): array
    {
        $phone = trim((string) ($data['phone'] ?? ''));
        $phone = preg_replace('/\s+/', ' ', $phone) ?? $phone;

        $name = trim((string) ($data['name'] ?? ''));
        $name = preg_replace('/\s+/', ' ', $name) ?? $name;

        return [
            'name' => $name,
            'email' => strtolower(trim((string) ($data['email'] ?? ''))),
            'phone' => $phone,
            'career' => $this->canonicalizeMajor((string) ($data['career'] ?? '')),
            'favorite_language' => $this->canonicalizeProgrammingLanguage((string) ($data['favorite_language'] ?? '')),
        ];
    }

    private function canonicalizeMajor(string $major): string
    {
        $major = trim($major);
        if ($major === '') {
            return '';
        }

        $normalized = $this->normalizeComparableText($major);

        return self::MAJOR_ALIASES[$normalized] ?? $major;
    }

    private function canonicalizeProgrammingLanguage(string $language): string
    {
        $language = trim($language);
        if ($language === '') {
            return '';
        }

        foreach (self::PROGRAMMING_LANGUAGES as $allowedLanguage) {
            if ($this->normalizeComparableText($allowedLanguage) === $this->normalizeComparableText($language)) {
                return $allowedLanguage;
            }
        }

        return $language;
    }

    private function normalizeComparableText(string $value): string
    {
        $value = trim($value);
        $value = strtr($value, [
            'á' => 'a', 'à' => 'a', 'ä' => 'a', 'â' => 'a', 'Á' => 'a', 'À' => 'a', 'Ä' => 'a', 'Â' => 'a',
            'é' => 'e', 'è' => 'e', 'ë' => 'e', 'ê' => 'e', 'É' => 'e', 'È' => 'e', 'Ë' => 'e', 'Ê' => 'e',
            'í' => 'i', 'ì' => 'i', 'ï' => 'i', 'î' => 'i', 'Í' => 'i', 'Ì' => 'i', 'Ï' => 'i', 'Î' => 'i',
            'ó' => 'o', 'ò' => 'o', 'ö' => 'o', 'ô' => 'o', 'Ó' => 'o', 'Ò' => 'o', 'Ö' => 'o', 'Ô' => 'o',
            'ú' => 'u', 'ù' => 'u', 'ü' => 'u', 'û' => 'u', 'Ú' => 'u', 'Ù' => 'u', 'Ü' => 'u', 'Û' => 'u',
            'ñ' => 'n', 'Ñ' => 'n',
        ]);
        $value = mb_strtolower($value);
        $value = preg_replace('/[^a-z0-9#+]+/', ' ', $value) ?? $value;

        return trim($value);
    }

    private function emailExists(string $email, ?string $exceptId = null): bool
    {
        $filter = ['email' => $email];

        if ($exceptId !== null && $this->isValidObjectId($exceptId)) {
            $filter['_id'] = ['$ne' => new ObjectId($exceptId)];
        }

        return $this->findOne($filter) !== null;
    }

    /**
     * @param array<string, mixed> $filter
     * @param array<string, mixed> $options
     */
    private function findOne(array $filter, array $options = []): ?object
    {
        $options['limit'] = 1;
        $documents = $this->findMany($filter, $options);

        return $documents[0] ?? null;
    }

    /**
     * @param array<string, mixed> $filter
     * @param array<string, mixed> $options
     * @return object[]
     */
    private function findMany(array $filter, array $options = []): array
    {
        $query = new Query($filter, $options);
        $cursor = $this->manager->executeQuery($this->namespace, $query);

        return $cursor->toArray();
    }

    /**
     * @return array<string, mixed>
     */
    private function formatStudent(object $student): array
    {
        $record = (array) $student;
        $major = $this->canonicalizeMajor((string) ($record['career'] ?? ''));
        $favoriteLanguage = $this->canonicalizeProgrammingLanguage((string) ($record['favorite_language'] ?? ''));

        return [
            'id' => isset($record['_id']) && $record['_id'] instanceof ObjectId ? (string) $record['_id'] : '',
            'name' => (string) ($record['name'] ?? ''),
            'email' => (string) ($record['email'] ?? ''),
            'phone' => (string) ($record['phone'] ?? ''),
            'career' => $major,
            'favorite_language' => $favoriteLanguage,
            'status' => (string) ($record['status'] ?? 'active'),
            'enrollment_date' => $this->formatDate($record['enrollment_date'] ?? null),
            'updated_date' => $this->formatDate($record['updated_date'] ?? null),
        ];
    }

    private function formatDate(mixed $value): string
    {
        if ($value instanceof UTCDateTime) {
            return $value->toDateTime()->format('Y-m-d H:i:s');
        }

        return '';
    }

    private function isValidObjectId(string $id): bool
    {
        return preg_match('/^[a-f0-9]{24}$/i', $id) === 1;
    }
}
