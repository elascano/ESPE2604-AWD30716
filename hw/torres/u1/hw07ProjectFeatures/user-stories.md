# User Stories

## Feature 1: Public Landing and Enrollment

### US-001 - View Academy Information
As a visitor, I want to view information about American Latin Class so that I can understand the academy before requesting enrollment.

Acceptance criteria:
- The landing page shows academy purpose, levels, branches, and contact options.
- The page works without login.
- The page is responsive.

### US-002 - Submit Enrollment Request
As a visitor, I want to submit an enrollment form so that the academy can contact me.

Acceptance criteria:
- The form requires name, phone, email, preferred branch, and level.
- The form stores the request as pending.
- The form shows a confirmation message.

### US-003 - Review New Enrollment Requests
As an administrator, I want to review pending enrollment requests so that I can convert valid requests into active students.

Acceptance criteria:
- Pending requests are visible in the admin view.
- Requests include branch and contact data.
- The administrator can identify the requested level and scholarship information.

## Feature 2: Student, Scholarship, and Attendance Control

### US-004 - Manage Student Classification
As an administrator, I want to classify each student by level and scholarship so that academic and financial rules can be applied correctly.

Acceptance criteria:
- Students can be B1 or B2.
- Scholarship can be 0%, 50%, 75%, or 100%.
- Student records include branch and status.

### US-005 - Register Student Attendance
As a teacher, I want to register student attendance so that the academy can validate scholarships and module continuity.

Acceptance criteria:
- Attendance includes date, branch, student, level, and status.
- Status can be present, absent, late, or excused.
- The record stores an evidence code.

### US-006 - Register Teacher Attendance and Planning
As a branch director, I want to review teacher attendance and monthly plans so that I can manage penalties, memos, and teaching quality.

Acceptance criteria:
- Teachers can submit monthly class plans.
- Teacher attendance can be recorded.
- Late or absent records can be used for administrative follow-up.

## Feature 3: Branch Finance and Professional Dancer Agency

### US-007 - Report Branch Finance
As a branch director, I want to report monthly income and expenses so that the general director can review branch performance.

Acceptance criteria:
- The branch report includes income, expenses, and net result.
- The system calculates the amount owed to the main branch.
- The general director can compare branches.

### US-008 - Track Professional Events for B2 Dancers
As an administrator, I want to register professional events for B2 dancers so that the academy can keep a history of participation and income.

Acceptance criteria:
- Events include client, type, date, branch, amount, and payment status.
- Dancers can be assigned to events.
- The system stores event history by dancer.

### US-009 - Calculate Dancer Settlement
As an administrator, I want to calculate dancer payments automatically so that paid events, penalties, and deductions are handled consistently.

Acceptance criteria:
- The calculation includes gross amount.
- The calculation subtracts deductions or penalties.
- The system shows net amount to pay.

