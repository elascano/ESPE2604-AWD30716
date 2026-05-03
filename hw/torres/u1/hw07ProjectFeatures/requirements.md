# American Latin Class Requirements

## 1. Project Context

American Latin Class is a dance academy with multiple branches. The academy trains dancers in different styles and classifies students into two main learning levels:

- **B1**: basic-intermediate students.
- **B2**: intermediate-advanced students with professional projection.

B2 dancers can participate in paid professional opportunities managed by the academy, such as quinceanera shows, wedding dances, choreographies, private classes, shows, television appearances, and special events.

The system must support academic management, branch administration, financial control, teacher planning, student attendance, scholarship control, parent communication, and professional dancer event history.

## 2. Product Vision

We want to build a web platform that centralizes the operation of American Latin Class and helps the general director, branch directors, teachers, students, parents, and visitors work with the same source of truth.

The system must include a public website, enrollment forms, administrative modules, attendance controls, scholarship tracking, teacher planning, branch finance reports, and professional event settlement for B2 dancers.

## 3. User Roles

| Role | Description |
| --- | --- |
| Visitor | Person who only views academy information and may request enrollment. |
| Student | Academy member classified as B1 or B2, with or without scholarship. |
| Parent | Family member who needs information about student progress, attendance, payments, and notices. |
| Teacher | Instructor who submits monthly class planning and records class work. |
| Branch Director | Person responsible for branch management, income, expenses, opportunities, and reports. |
| Co-director | Branch support role with delegated operational permissions. |
| General Director | Main authority with access to every branch and global rules. |
| Administrator | System role for configuration, users, roles, branches, and data maintenance. |

## 4. Functional Requirements

### Public Website and Enrollment

- FR-001: The system shall provide a landing page with academy information, branches, dance programs, and contact options.
- FR-002: The system shall show basic information for visitors without requiring login.
- FR-003: The system shall provide an enrollment form for people who want to join the academy.
- FR-004: The enrollment form shall collect student name, contact data, preferred branch, preferred level, parent or guardian information, and comments.
- FR-005: The system shall store enrollment requests as pending records for administrative review.

### Student Management

- FR-006: The system shall register students with branch, level, status, phone, email, and guardian data.
- FR-007: The system shall classify students as B1 or B2.
- FR-008: The system shall classify scholarship percentage as 0%, 50%, 75%, or 100%.
- FR-009: The system shall show student attendance history.
- FR-010: The system shall show student payment and scholarship status.
- FR-011: The system shall prevent duplicate student records using email or phone.

### Parent Section

- FR-012: The system shall include a parent section with student attendance summary.
- FR-013: The system shall show relevant notices for parents.
- FR-014: The system shall allow parents to review enrollment or payment reminders.

### Teacher Management

- FR-015: The system shall allow teachers to submit their monthly class plan during the first week of the month.
- FR-016: The class plan shall include branch, teacher, month, level, objective, and activities.
- FR-017: The system shall allow student attendance registration.
- FR-018: The system shall allow teacher attendance registration.
- FR-019: Teacher attendance shall support penalties, memos, or administrative follow-up when needed.

### Branch Management

- FR-020: The system shall manage multiple branches.
- FR-021: Each branch shall have one director and optionally one or more co-directors.
- FR-022: Branch directors shall report monthly income, expenses, student count, opportunities, events, and competitions.
- FR-023: Branch directors shall follow the rules defined by the general director and the main branch.
- FR-024: The general director shall be able to review all branch information.

### Finance

- FR-025: The system shall register income by branch.
- FR-026: The system shall register expenses by branch.
- FR-027: The system shall calculate monthly branch results.
- FR-028: The system shall calculate the percentage that each branch must send to the main branch.
- FR-029: The system shall register the main branch emergency reserve.
- FR-030: The system shall show consolidated academy financial indicators.

### Professional Dancer Agency

- FR-031: The system shall register B2 dancers as professional candidates.
- FR-032: The system shall register professional events for B2 dancers.
- FR-033: Events shall include client, type, date, amount, payment status, and branch.
- FR-034: The system shall register which dancers participated in each event.
- FR-035: The system shall calculate gross amount, deductions, penalties, and final amount to pay each dancer.
- FR-036: The system shall store the event and income history of each B2 dancer.

### Security and Permissions

- FR-037: The system shall support role-based access control.
- FR-038: Branch directors shall access only their branch unless authorized by the general director.
- FR-039: The general director shall access all branches.
- FR-040: Administrative actions shall be auditable.

## 5. Non-Functional Requirements

- NFR-001: The system shall use Supabase as the database platform.
- NFR-002: The backend shall use PHP with a backend framework.
- NFR-003: The PHP backend shall use an ORM layer to map database tables to project models.
- NFR-004: The frontend shall be responsive for desktop and mobile.
- NFR-005: The public frontend shall be deployable through Netlify.
- NFR-006: The code shall be organized, readable, and consistent with clean code principles.
- NFR-007: The system shall protect sensitive actions with authentication and roles in a production version.
- NFR-008: Supabase RLS policies shall be stricter before production use.
- NFR-009: The system shall use English names in code, UI labels, and project deliverables.

## 6. Pending Validation With the Owner

- Exact branch directors and co-directors.
- Exact percentage that each branch sends to the main branch.
- Exact scholarship rules for 50%, 75%, and 100%.
- Exact attendance threshold for scholarship loss or module loss.
- Teacher penalty and memo rules.
- Professional event commission formula.
- Emergency reserve policy.
- Payment methods and receipt requirements.
- Final role permission matrix.

