const APPOINTMENTS_STORAGE_KEY = "barberia_style_appointments";

function getAppointments() {
    return JSON.parse(localStorage.getItem(APPOINTMENTS_STORAGE_KEY)) || [];
}

function saveAppointments(appointments) {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
}

function createAppointment(appointment) {
    const appointmentList = getAppointments();
    appointmentList.push(appointment);
    saveAppointments(appointmentList);
}
