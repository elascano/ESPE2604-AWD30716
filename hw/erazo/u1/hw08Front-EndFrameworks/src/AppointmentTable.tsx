import type { AppointmentData } from './types';

interface AppointmentTableProps {
  appointments: AppointmentData[];
  isLoading: boolean;
}

export const AppointmentTable = ({ appointments, isLoading }: AppointmentTableProps) => {
  if (isLoading) {
    return <div className="empty-state">Loading appointments from MongoDB...</div>;
  }

  if (appointments.length === 0) {
    return <div className="empty-state">No appointments have been scheduled yet.</div>;
  }

  return (
    <div className="table-shell">
      <table>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Therapist</th>
            <th>Therapy</th>
            <th>Date</th>
            <th>Time</th>
            <th>Duration</th>
            <th>Room</th>
            <th>Status</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment._id}>
              <td>{appointment.patientName}</td>
              <td>{appointment.therapistName}</td>
              <td>{appointment.therapyType}</td>
              <td>{appointment.appointmentDate}</td>
              <td>{appointment.appointmentTime}</td>
              <td>{appointment.durationMinutes} min</td>
              <td>{appointment.room}</td>
              <td>
                <span className={`status-pill ${appointment.status.toLowerCase()}`}>
                  {appointment.status}
                </span>
              </td>
              <td>{appointment.patientPhone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
