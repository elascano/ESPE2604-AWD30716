import type { AppointmentData } from './types';

interface AppointmentTableProps {
  appointments: AppointmentData[];
  isLoading: boolean;
}

export const AppointmentTable = ({ appointments, isLoading }: AppointmentTableProps) => {
  if (isLoading) {
    return <div className="empty-state">Loading appointments from MongoDB..</div>;
  }

  if (appointments.length === 0) {
    return <div className="empty-state">No info</div>;
  }

  return (
    <div className="table-shell">
      <table>
        <thead>
          <tr>
            <th>Team Follower</th>
            <th>soccerTeamName</th>
            <th>bestPlayerOAT</th>
            <th>rivalTeam</th>
            <th>CityTeam</th>
            <th>championships</th>
            <th>worstPlayer</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment._id}>
              <td>{appointment.userName}</td>
              <td>{appointment.soccerTeamName}</td>
              <td>{appointment.bestPlayerOAT}</td>
              <td>{appointment.rivalTeam}</td>
              <td>{appointment.CityTeam}</td>
              <td>{appointment.championships}</td>
              <td>{appointment.worstPlayer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
