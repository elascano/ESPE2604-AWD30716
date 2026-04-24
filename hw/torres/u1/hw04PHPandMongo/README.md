# Customer CRUD for `students.Customer`

PHP project with a validated CRUD form for the `Customer` collection inside the
`students` database.

## What changed

- Full CRUD support: create, list, edit, delete, and search
- Client-side and server-side validation
- CSRF protection for write actions
- Search support for name, email, phone, major, and favorite programming language
- Email normalization in lowercase
- The old `GPA` field was removed
- A new `favorite programming language` field was added
- The main application pages were translated to English
- Configuration via `.env` and `.env.local`
- Automated functional test included

## Current target collection

```env
MONGODB_DATABASE=students
MONGODB_COLLECTION=Customer
```

If you use MongoDB Atlas, keep the working URI in `.env.local`.

## Requirements

- Windows with XAMPP installed
- `C:\xampp\php\php.exe`
- MongoDB connectivity to the target cluster
- `ext-mongodb` enabled for that PHP installation

## How to run

1. Confirm the MongoDB connection is reachable.
2. Review `.env` and `.env.local`.
3. Start the PHP server:

```powershell
C:\xampp\php\php.exe -S 127.0.0.1:8000
```

4. Open:

```text
http://127.0.0.1:8000/index.php
```

## Quick checks

- Environment verification page:

```text
http://127.0.0.1:8000/verify.php
```

- Automated CRUD test:

```powershell
C:\xampp\php\php.exe functional-test.php
```

## Main files

- `index.php`: controller and UI
- `crud-operations.php`: validation and CRUD logic
- `db-config.php`: connection, ping, and indexes
- `app-config.php`: `.env` loader
- `functional-test.php`: automated create/read/search/update/delete test
- `verify.php`: environment and connection check

## Security notes

- CSRF token required for create, update, and delete
- `ObjectId` validation before read, update, and delete
- HTML escaping on output
- Regex-safe search using `preg_quote`
- Credentials kept in environment files instead of public docs
