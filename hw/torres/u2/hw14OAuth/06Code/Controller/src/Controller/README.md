# Controllers

Controllers are the HTTP boundary of the backend.

They should:

- Read route arguments, query parameters, and request body data.
- Call validators and services.
- Return JSON through `JsonResponder`.
- Keep role decisions in middleware or access services.

They should not:

- Store reusable validation rules.
- Build database connections.
- Own token logic.
- Contain large business calculations.
