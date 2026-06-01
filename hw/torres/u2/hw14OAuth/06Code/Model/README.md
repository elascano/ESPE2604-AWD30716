# Models

Models are Eloquent ORM classes for Supabase PostgreSQL tables.

They should stay focused on data mapping:

- Table names.
- Fillable fields.
- Casts.
- Relationships.

HTTP request handling, validation workflows, token logic, and business calculations belong in controllers or services instead.
