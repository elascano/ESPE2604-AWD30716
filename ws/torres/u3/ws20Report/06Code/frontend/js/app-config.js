class AppConfig {
  constructor() {
    this.apiBase = window.API_BASE_URL || "http://18.217.255.109:8080";
    this.sessionKey = "alc-session";

    this.roleLabels = {
      teacher: "Teacher portal",
      student: "Student portal",
      director: "Director portal"
    };

    this.modulesByRole = {
      student: [
        { id: "student-overview", slug: "overview", icon: "bi-speedometer2", label: "Progress" },
        { id: "student-schedule", slug: "schedule", icon: "bi-calendar-week", label: "Schedule" },
        { id: "student-attendance", slug: "attendance", icon: "bi-calendar2-check", label: "Attendance" },
        { id: "student-events", slug: "events", icon: "bi-stars", label: "Events" }
      ],
      teacher: [
        { id: "teacher-overview", slug: "overview", icon: "bi-clock-history", label: "Work summary" },
        { id: "teacher-student-attendance", slug: "students", icon: "bi-person-check", label: "Student attendance" },
        { id: "teacher-planning", slug: "planning", icon: "bi-file-earmark-arrow-up", label: "Planning" },
        { id: "teacher-work-log", slug: "work-log", icon: "bi-table", label: "Work log" }
      ],
      director: [
        { id: "director-overview", slug: "overview", icon: "bi-grid", label: "Overview" },
        { id: "director-students", slug: "students", icon: "bi-mortarboard", label: "Students" },
        { id: "director-teachers", slug: "teachers", icon: "bi-person-workspace", label: "Teachers" },
        { id: "director-payroll", slug: "payroll", icon: "bi-cash-coin", label: "Payroll" },
        { id: "director-planning", slug: "planning", icon: "bi-journal-check", label: "Planning" },
        { id: "director-finance", slug: "finance", icon: "bi-bar-chart", label: "Finance" },
        { id: "director-events", slug: "events", icon: "bi-calendar-event", label: "B2 events" }
      ]
    };

    this.routeAliases = {
      overview: "overview",
      overviews: "overview",
      students: "students",
      teachers: "teachers",
      payroll: "payroll",
      planning: "planning",
      finance: "finance",
      events: "events",
      attendance: "attendance",
      schedule: "schedule",
      "work-log": "work-log"
    };

    this.defaultSchedules = {
      B1: [
        "Monday and Wednesday, 18:00 - Technique",
        "Friday, 17:00 - Choreography review"
      ],
      B2: [
        "Tuesday and Thursday, 19:00 - Performance training",
        "Saturday, 10:00 - Stage rehearsal"
      ]
    };

    this.upcomingEvents = [
      { title: "Monthly showcase", date: "2026-06-08", branch: "Matrix" },
      { title: "Urban technique review", date: "2026-06-15", branch: "North" },
      { title: "B2 professional rehearsal", date: "2026-06-22", branch: "Tumbaco" }
    ];
  }
}
