function bindAppointmentForm() {
    const appointmentForm = document.getElementById("appointmentForm");
    if (!appointmentForm) return;

    appointmentForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const haircutTypeSelect = document.getElementById("haircutType");
        const hairTypeSelect = document.getElementById("hairType");

        const appointment = {
            fullName: document.getElementById("fullName").value,
            date: document.getElementById("appointmentDate").value,
            time: document.getElementById("appointmentTime").value,
            haircutType: haircutTypeSelect.options[haircutTypeSelect.selectedIndex].text,
            hairType: hairTypeSelect.options[hairTypeSelect.selectedIndex].text
        };

        createAppointment(appointment);
        alert("Cita agendada exitosamente");
        appointmentForm.reset();
        window.location.href = "haircut-schedule.html";
    });
}

function renderAppointmentsTable() {
    const appointmentsTableBody = document.getElementById("appointmentsTableBody");
    if (!appointmentsTableBody) return;

    const appointments = getAppointments();
    if (appointments.length === 0) {
        appointmentsTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#999;">No hay citas registradas aun</td></tr>';
        return;
    }

    appointmentsTableBody.innerHTML = "";
    appointments.forEach((appointment) => {
        appointmentsTableBody.innerHTML += `<tr>
            <td>${appointment.fullName}</td>
            <td>${appointment.date}</td>
            <td>${appointment.time}</td>
            <td>${appointment.haircutType}</td>
            <td>${appointment.hairType}</td>
        </tr>`;
    });
}

window.addEventListener("DOMContentLoaded", () => {
    bindAppointmentForm();
    renderAppointmentsTable();
});
