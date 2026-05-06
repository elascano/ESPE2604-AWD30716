# Meeting Minutes

## Meeting Information

- Project: American Latin Class Web System
- Date: May 3, 2026
- Client representative: Juan Pablo Hidalgo
- Student team: Alexander Torres and Evelyn Villarreal
- Document purpose: summarize the initial functional conversation and convert it into requirements.

## Main Points Discussed

American Latin Class is a dance academy that trains students in different dance styles. Students are classified into B1 and B2 levels.

B1 students are basic-intermediate students. B2 students are intermediate-advanced students who can be prepared for a more professional environment.

B2 dancers may receive paid work opportunities managed by the academy. These opportunities can include quinceanera events, wedding dances, choreographies, private classes, shows, television appearances, and other events.

The academy needs a public landing page for visitors who want to learn about the academy and an enrollment form for people who want to join.

The system must support several user types: administrator, student, parent, visitor, teacher, branch director, co-director, and general director.

Students may be normal students without scholarship or scholarship students with 50%, 75%, or 100% scholarship.

Student attendance must be controlled because attendance is used to validate scholarships, module loss, and academic continuity.

Teachers must submit their monthly class planning during the first week of each month.

Teacher attendance must also be controlled because absences or delays can generate fines, memos, or administrative follow-up.

American Latin Class has multiple branches. Each branch has a director and usually one co-director.

Branch directors manage the operation of their branch, but they must follow the rules established by the general director and the main branch.

The general director, Juan Pablo Hidalgo, must have access to the full administrative view.

Branch directors must report monthly income, expenses, student count, event opportunities, shows, and competitions.

Branches must send a percentage of their income to the main branch. The percentage is defined by the general director.

The main branch keeps an emergency reserve for unexpected situations.

B2 dancers must have a professional history showing events attended, paid events, penalties, deductions, and the final amount to pay.

## Decisions

- The MVP will include landing page, enrollment form, student classification, attendance, teacher planning, branch finance summary, and B2 event tracking.
- Supabase will be used as the database platform.
- PHP will be used for the backend assignment with a backend framework and ORM.
- Netlify will be used for the public frontend deployment if credentials are available.

## Pending Questions

- What are the exact names of all branch directors and co-directors?
- What percentage does each branch send to the main branch?
- What exact attendance percentage causes scholarship review or module loss?
- What are the exact rules for teacher fines and memos?
- What is the exact commission formula for paid events?
- What is the policy for the main branch emergency reserve?
- What payment methods and receipt format should be used?

