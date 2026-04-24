<?php
declare(strict_types=1);

require_once __DIR__ . '/crud-operations.php';

session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
]);

header('Content-Type: text/html; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');

AppConfig::load();
date_default_timezone_set(AppConfig::env('APP_TIMEZONE', 'America/Bogota') ?? 'America/Bogota');

/**
 * @param mixed $value
 */
function h($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

/**
 * @param array<string, mixed> $value
 */
function flashSet(string $key, array $value): void
{
    $_SESSION['flash'][$key] = $value;
}

/**
 * @return array<string, mixed>
 */
function flashGet(string $key): array
{
    if (!isset($_SESSION['flash'][$key]) || !is_array($_SESSION['flash'][$key])) {
        return [];
    }

    $value = $_SESSION['flash'][$key];
    unset($_SESSION['flash'][$key]);

    return $value;
}

function currentCsrfToken(): string
{
    if (empty($_SESSION['csrf_token']) || !is_string($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['csrf_token'];
}

function buildLocation(?string $searchQuery = null, ?string $editId = null): string
{
    $params = [];

    if ($editId !== null && $editId !== '') {
        $params['action'] = 'edit';
        $params['id'] = $editId;
    }

    if ($searchQuery !== null && trim($searchQuery) !== '') {
        $params['q'] = trim($searchQuery);
    }

    return $params === [] ? 'index.php' : 'index.php?' . http_build_query($params);
}

$crud = null;
$appError = '';

try {
    $crud = new StudentCRUD();
} catch (Throwable $exception) {
    $appError = $exception->getMessage();
}

$defaultFormData = $crud ? $crud->getEmptyFormData() : [
    'id' => '',
    'name' => '',
    'email' => '',
    'phone' => '',
    'career' => '',
    'favorite_language' => '',
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postedAction = trim((string) ($_POST['action'] ?? ''));
    $returnQuery = trim((string) ($_POST['return_query'] ?? ''));
    $postedId = trim((string) ($_POST['id'] ?? ''));

    if (!hash_equals(currentCsrfToken(), (string) ($_POST['csrf_token'] ?? ''))) {
        flashSet('response', [
            'success' => false,
            'error' => 'The form session expired. Please try again.',
        ]);

        header('Location: ' . buildLocation($returnQuery, $postedAction === 'update' ? $postedId : null));
        exit;
    }

    if ($crud === null) {
        flashSet('response', [
            'success' => false,
            'error' => 'The application could not connect to MongoDB.',
        ]);

        header('Location: ' . buildLocation($returnQuery));
        exit;
    }

    if ($postedAction === 'create') {
        $response = $crud->create($_POST);
        flashSet('response', $response);

        if (!$response['success']) {
            flashSet('formData', $crud->formDataFromInput($_POST));
        }

        header('Location: ' . buildLocation($returnQuery));
        exit;
    }

    if ($postedAction === 'update') {
        $response = $crud->update($postedId, $_POST);
        flashSet('response', $response);

        if (!$response['success']) {
            flashSet('formData', $crud->formDataFromInput($_POST));
        }

        $location = $response['success']
            ? buildLocation($returnQuery)
            : buildLocation($returnQuery, $postedId);

        header('Location: ' . $location);
        exit;
    }

    if ($postedAction === 'delete') {
        flashSet('response', $crud->delete($postedId));
        header('Location: ' . buildLocation($returnQuery));
        exit;
    }

    flashSet('response', [
        'success' => false,
        'error' => 'The requested action is not valid.',
    ]);

    header('Location: ' . buildLocation($returnQuery));
    exit;
}

$response = flashGet('response');
$formData = array_replace($defaultFormData, flashGet('formData'));
$action = trim((string) ($_GET['action'] ?? ''));
$editId = trim((string) ($_GET['id'] ?? ''));
$searchQuery = trim((string) ($_GET['q'] ?? ''));

if ($crud !== null && $action === 'edit' && $editId !== '' && $formData['id'] === '') {
    $student = $crud->readById($editId);

    if ($student !== null) {
        $formData = array_replace($formData, $student);
    } else {
        $response = [
            'success' => false,
            'error' => 'The requested record does not exist or the ID is invalid.',
        ];
    }
}

$students = $crud === null
    ? []
    : ($searchQuery !== '' ? $crud->search($searchQuery) : $crud->readAll());

$stats = $crud === null
    ? ['total_students' => 0, 'languages_used' => 0]
    : $crud->getStats();

$majors = $crud?->getMajors() ?? [];
$programmingLanguages = $crud?->getProgrammingLanguages() ?? [];
$csrfToken = currentCsrfToken();
$isEditMode = $formData['id'] !== '';
$pageTitle = $isEditMode ? 'Edit record' : 'Add record';
$emptyMessage = $searchQuery !== ''
    ? 'No matches were found for your current search.'
    : 'There are no records in this collection yet.';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRUD students.Customer</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="page-shell">
        <header class="hero">
            <div>
                <p class="eyebrow">MongoDB · students.Customer</p>
                <h1>Customer records with strong validation</h1>
                <p class="hero-copy">
                    A full CRUD form with secure search, CSRF protection, and consistent
                    validation on both the client and the server.
                </p>
            </div>
            <div class="hero-metrics">
                <article class="metric-card">
                    <span class="metric-label">Records</span>
                    <strong class="metric-value"><?= h((string) $stats['total_students']) ?></strong>
                </article>
                <article class="metric-card">
                    <span class="metric-label">Languages Used</span>
                    <strong class="metric-value"><?= h((string) $stats['languages_used']) ?></strong>
                </article>
            </div>
        </header>

        <?php if ($appError !== ''): ?>
            <section class="alert-banner alert-error show">
                <strong>The application could not start.</strong>
                <span><?= h($appError) ?></span>
            </section>
        <?php endif; ?>

        <?php if (!empty($response)): ?>
            <section class="alert-banner <?= !empty($response['success']) ? 'alert-success show' : 'alert-error show' ?>">
                <strong><?= !empty($response['success']) ? 'Action completed.' : 'Please review the form.' ?></strong>
                <span><?= h((string) ($response['message'] ?? $response['error'] ?? 'Please review the highlighted fields.')) ?></span>
            </section>
        <?php endif; ?>

        <main class="layout-grid">
            <section class="panel form-panel">
                <div class="panel-header">
                    <div>
                        <p class="panel-kicker"><?= $isEditMode ? 'Edit mode' : 'New record' ?></p>
                        <h2><?= h($pageTitle) ?></h2>
                    </div>
                    <?php if ($isEditMode): ?>
                        <a class="ghost-link" href="<?= h(buildLocation($searchQuery)) ?>">Cancel editing</a>
                    <?php endif; ?>
                </div>

                <form id="studentForm" method="POST" novalidate>
                    <input type="hidden" name="csrf_token" value="<?= h($csrfToken) ?>">
                    <input type="hidden" name="action" value="<?= $isEditMode ? 'update' : 'create' ?>">
                    <input type="hidden" name="return_query" value="<?= h($searchQuery) ?>">
                    <?php if ($isEditMode): ?>
                        <input type="hidden" name="id" value="<?= h($formData['id']) ?>">
                    <?php endif; ?>

                    <div class="field-group <?= isset($response['errors']['name']) ? 'has-error' : '' ?>">
                        <label for="name">Full name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            maxlength="120"
                            autocomplete="name"
                            value="<?= h($formData['name']) ?>"
                            placeholder="Example: John Carter"
                            required
                        >
                        <small class="field-hint">Use letters, spaces, apostrophes, periods, and hyphens only.</small>
                        <span class="error-message"><?= h((string) ($response['errors']['name'] ?? '')) ?></span>
                    </div>

                    <div class="field-group <?= isset($response['errors']['email']) ? 'has-error' : '' ?>">
                        <label for="email">Email address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            maxlength="160"
                            autocomplete="email"
                            value="<?= h($formData['email']) ?>"
                            placeholder="Example: john@example.com"
                            required
                        >
                        <small class="field-hint">Emails are stored in lowercase and must be unique.</small>
                        <span class="error-message"><?= h((string) ($response['errors']['email'] ?? '')) ?></span>
                    </div>

                    <div class="field-group <?= isset($response['errors']['phone']) ? 'has-error' : '' ?>">
                        <label for="phone">Phone number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            autocomplete="tel"
                            inputmode="tel"
                            value="<?= h($formData['phone']) ?>"
                            placeholder="Example: +57 300 123 4567"
                            required
                        >
                        <small class="field-hint">The number must contain between 7 and 15 digits.</small>
                        <span class="error-message"><?= h((string) ($response['errors']['phone'] ?? '')) ?></span>
                    </div>

                    <div class="field-group <?= isset($response['errors']['career']) ? 'has-error' : '' ?>">
                        <label for="career">Major</label>
                        <select id="career" name="career" required>
                            <option value="">Select a major</option>
                            <?php foreach ($majors as $major): ?>
                                <option value="<?= h($major) ?>" <?= $formData['career'] === $major ? 'selected' : '' ?>>
                                    <?= h($major) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                        <small class="field-hint">Only the official majors listed here are accepted.</small>
                        <span class="error-message"><?= h((string) ($response['errors']['career'] ?? '')) ?></span>
                    </div>

                    <div class="field-group <?= isset($response['errors']['favorite_language']) ? 'has-error' : '' ?>">
                        <label for="favorite_language">Favorite programming language</label>
                        <select id="favorite_language" name="favorite_language" required>
                            <option value="">Select a language</option>
                            <?php foreach ($programmingLanguages as $language): ?>
                                <option value="<?= h($language) ?>" <?= $formData['favorite_language'] === $language ? 'selected' : '' ?>>
                                    <?= h($language) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                        <small class="field-hint">Choose the language this person prefers the most.</small>
                        <span class="error-message"><?= h((string) ($response['errors']['favorite_language'] ?? '')) ?></span>
                    </div>

                    <?php if ($isEditMode): ?>
                        <div class="meta-card">
                            <span><strong>ID:</strong> <?= h($formData['id']) ?></span>
                            <?php if (!empty($formData['updated_date'])): ?>
                                <span><strong>Last updated:</strong> <?= h((string) $formData['updated_date']) ?></span>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>

                    <div class="button-row">
                        <button type="submit" class="btn btn-primary">
                            <?= $isEditMode ? 'Save changes' : 'Create record' ?>
                        </button>
                        <button type="reset" class="btn btn-secondary">Reset form</button>
                    </div>
                </form>
            </section>

            <section class="panel table-panel">
                <div class="panel-header panel-header-stack">
                    <div>
                        <p class="panel-kicker">Search and manage</p>
                        <h2>Record list</h2>
                    </div>

                    <form class="search-form" method="GET">
                        <label class="sr-only" for="q">Search records</label>
                        <input
                            type="search"
                            id="q"
                            name="q"
                            value="<?= h($searchQuery) ?>"
                            placeholder="Search by name, email, phone, major, or language"
                        >
                        <button type="submit" class="btn btn-search">Search</button>
                        <?php if ($searchQuery !== ''): ?>
                            <a class="ghost-link" href="index.php">Clear</a>
                        <?php endif; ?>
                    </form>
                </div>

                <div class="results-summary">
                    <span><?= h((string) count($students)) ?> result(s)</span>
                    <?php if ($searchQuery !== ''): ?>
                        <span>Active filter: "<?= h($searchQuery) ?>"</span>
                    <?php endif; ?>
                </div>

                <?php if ($students !== []): ?>
                    <div class="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Major</th>
                                    <th>Favorite language</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($students as $student): ?>
                                    <tr>
                                        <td>
                                            <strong><?= h((string) $student['name']) ?></strong>
                                            <?php if (!empty($student['enrollment_date'])): ?>
                                                <small class="row-meta">Created: <?= h((string) $student['enrollment_date']) ?></small>
                                            <?php endif; ?>
                                        </td>
                                        <td><?= h((string) $student['email']) ?></td>
                                        <td><?= h((string) $student['phone']) ?></td>
                                        <td><?= h((string) $student['career']) ?></td>
                                        <td>
                                            <span class="badge gpa-medium"><?= h((string) ($student['favorite_language'] !== '' ? $student['favorite_language'] : 'Not set')) ?></span>
                                        </td>
                                        <td>
                                            <span class="status-pill status-<?= h(strtolower((string) $student['status'])) ?>">
                                                <?= h(ucfirst((string) $student['status'])) ?>
                                            </span>
                                        </td>
                                        <td>
                                            <div class="table-actions">
                                                <a
                                                    class="btn btn-small btn-edit"
                                                    href="<?= h(buildLocation($searchQuery, (string) $student['id'])) ?>"
                                                >
                                                    Edit
                                                </a>
                                                <form
                                                    method="POST"
                                                    class="inline-form"
                                                    data-delete-form
                                                    data-student-name="<?= h((string) $student['name']) ?>"
                                                >
                                                    <input type="hidden" name="csrf_token" value="<?= h($csrfToken) ?>">
                                                    <input type="hidden" name="action" value="delete">
                                                    <input type="hidden" name="id" value="<?= h((string) $student['id']) ?>">
                                                    <input type="hidden" name="return_query" value="<?= h($searchQuery) ?>">
                                                    <button type="submit" class="btn btn-small btn-danger">Delete</button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php else: ?>
                    <div class="empty-state">
                        <h3>No results</h3>
                        <p><?= h($emptyMessage) ?></p>
                    </div>
                <?php endif; ?>
            </section>
        </main>
    </div>

    <script>
        const allowedMajors = <?= json_encode(array_values($majors), JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) ?>;
        const allowedLanguages = <?= json_encode(array_values($programmingLanguages), JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) ?>;
        const form = document.getElementById('studentForm');
        const fields = form ? Array.from(form.querySelectorAll('input[name], select[name]')) : [];

        const validators = {
            name(value) {
                const clean = value.trim().replace(/\s+/g, ' ');
                if (!clean) return 'Full name is required.';
                if (clean.length < 2 || clean.length > 120) return 'Full name must be between 2 and 120 characters.';
                if (!/^[\p{L}\p{M}\s'.-]+$/u.test(clean)) return 'Use letters, spaces, apostrophes, periods, and hyphens only.';
                return '';
            },
            email(value) {
                const clean = value.trim().toLowerCase();
                if (!clean) return 'Email address is required.';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return 'Enter a valid email address.';
                if (clean.length > 160) return 'Email address is too long.';
                return '';
            },
            phone(value) {
                const clean = value.trim().replace(/\s+/g, ' ');
                const digits = clean.replace(/\D/g, '');
                if (!clean) return 'Phone number is required.';
                if (!/^\+?[0-9\s\-()]+$/.test(clean)) return 'Use digits, spaces, parentheses, and hyphens only.';
                if (digits.length < 7 || digits.length > 15) return 'Phone number must contain between 7 and 15 digits.';
                return '';
            },
            career(value) {
                if (!value.trim()) return 'Please select a major.';
                if (!allowedMajors.includes(value.trim())) return 'The selected major is not valid.';
                return '';
            },
            favorite_language(value) {
                if (!value.trim()) return 'Please select a favorite programming language.';
                if (!allowedLanguages.includes(value.trim())) return 'The selected programming language is not valid.';
                return '';
            }
        };

        function setFieldState(field, errorMessage) {
            const wrapper = field.closest('.field-group');
            if (!wrapper) return;

            const errorNode = wrapper.querySelector('.error-message');
            wrapper.classList.toggle('has-error', Boolean(errorMessage));
            wrapper.classList.toggle('is-valid', !errorMessage && field.value.trim() !== '');

            if (errorNode) {
                errorNode.textContent = errorMessage;
            }
        }

        function validateField(field) {
            if (!field || !validators[field.name]) {
                return '';
            }

            const errorMessage = validators[field.name](field.value);
            setFieldState(field, errorMessage);

            return errorMessage;
        }

        fields.forEach((field) => {
            if (!validators[field.name]) return;

            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.closest('.field-group')?.classList.contains('has-error')) {
                    validateField(field);
                }
            });
        });

        if (form) {
            form.addEventListener('submit', (event) => {
                let firstInvalidField = null;

                fields.forEach((field) => {
                    const errorMessage = validateField(field);
                    if (errorMessage && !firstInvalidField) {
                        firstInvalidField = field;
                    }
                });

                if (firstInvalidField) {
                    event.preventDefault();
                    firstInvalidField.focus();
                }
            });

            form.addEventListener('reset', () => {
                window.setTimeout(() => {
                    form.querySelectorAll('.field-group').forEach((wrapper) => {
                        wrapper.classList.remove('has-error', 'is-valid');
                        const errorNode = wrapper.querySelector('.error-message');
                        if (errorNode && !wrapper.classList.contains('server-error')) {
                            errorNode.textContent = '';
                        }
                    });
                }, 0);
            });
        }

        document.querySelectorAll('[data-delete-form]').forEach((deleteForm) => {
            deleteForm.addEventListener('submit', (event) => {
                const studentName = deleteForm.getAttribute('data-student-name') || 'this record';
                const confirmed = window.confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`);

                if (!confirmed) {
                    event.preventDefault();
                }
            });
        });

        window.setTimeout(() => {
            document.querySelectorAll('.alert-banner.show').forEach((alert) => {
                alert.classList.remove('show');
            });
        }, 6000);
    </script>
</body>
</html>
