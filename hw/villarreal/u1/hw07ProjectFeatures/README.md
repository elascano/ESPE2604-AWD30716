# HW07 - Project Features

This folder contains the planning package for the **American Latin Class** system.

The purpose of this assignment is to organize the requirements before building the Jira work plan. The documents are written from our project perspective and can be used to explain the scope to the teacher and to the academy owner.

## Contents

- `requirements.md`: complete functional and non-functional requirements.
- `user-stories.md`: user stories with acceptance criteria.
- `project-backlog.md`: prioritized backlog.
- `meeting-minutes.md`: meeting minutes based on the conversation with Juan Pablo Hidalgo.
- `jira/jira-import.csv`: 3 features and 9 tasks ready to create in Jira.
- `jira/created-jira-issues.md`: Jira issue keys created in the online board.
- `diagrams/class-diagram.puml`: class diagram in PlantUML format.
- `diagrams/use-case-diagram.puml`: use case diagram in PlantUML format.
- `implemented-features.md`: evidence that the three Jira features were also programmed.
- `programmed-features/hw08-front-end-copy/`: copied frontend implementation from HW08, included here as backup evidence.

## Jira Scope Required by the Assignment

We selected 3 features. Each feature has 3 tasks:

1. Public Landing and Enrollment
2. Student, Scholarship, and Attendance Control
3. Branch Finance and Professional Dancer Agency

This keeps the Jira board small enough for the assignment, but still connected to the real project scope.

## Published Frontend

The programmed frontend for the selected features is published here:

```text
https://creative-pothos-6c7a4c.netlify.app
```

## Public Backend

The PHP backend is published on Railway:

```text
https://american-latin-class-backend-production.up.railway.app
```

Health check:

```text
https://american-latin-class-backend-production.up.railway.app/api/health
```

The backend was deployed from the local folder with Railway CLI, without uploading the project to a Git repository.
