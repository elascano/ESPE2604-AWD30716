# Services

Services contain reusable application behavior.

Examples:

- `AuthService`: login, token issuing, and public user payloads.
- `BranchAccessService`: branch scope and write permissions.
- `DateRangeService`: monthly date windows.
- `AttendanceSummaryService`: attendance totals.
- `TeacherPayrollService`: teacher payment calculations.
- `AuditLogger`: protected write-action audit records.

Services keep controllers readable and support single-responsibility design.
