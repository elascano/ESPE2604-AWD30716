import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { AppointmentData } from './types';

interface AppointmentFormProps {
  onCreateAppointment: (appointment: AppointmentData) => Promise<void>;
}

const emptyAppointment: AppointmentData = {
  userName: '',
  soccerTeamName: '',
  bestPlayerOAT: '',
  rivalTeam: '',
  CityTeam: '',
  championships: 1,
  worstPlayer: '',

};

export const AppointmentForm = ({ onCreateAppointment }: AppointmentFormProps) => {
  const [appointment, setAppointment] = useState<AppointmentData>(emptyAppointment);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const nextValue = name === 'durationMinutes' ? Number(value) : value;

    setAppointment((currentAppointment) => ({
      ...currentAppointment,
      [name]: nextValue,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    await onCreateAppointment(appointment);
    setAppointment(emptyAppointment);
    setIsSaving(false);
  };

  return (
    <form className="appointment-form" onSubmit={handleSubmit}>
      <div className="section-heading">
        <span>New Team Follower</span>
        <h2>Enter Information</h2>
      </div>

      <div className="form-grid">
        <label>
          Team Follower Name
          <input name="userName" value={appointment.userName} onChange={handleInputChange} placeholder="Isaac Erazo" required />
        </label>

        <label>
          Soccer Team you follow
          <input name="soccerTeamName" value={appointment.soccerTeamName} onChange={handleInputChange} placeholder="Barcelona" required />
        </label>

        <label>
          Who is the best player of the team?
          <input name="bestPlayerOAT" value={appointment.bestPlayerOAT} onChange={handleInputChange} placeholder="Leo Messi" required />
        </label>

        <label>
          Which team is the rival of your team
          <input name="rivalTeam" value={appointment.rivalTeam} onChange={handleInputChange} placeholder="Real Madrid" required />
        </label>

        <label>
          Which City is the home of your Team?
          <input name="CityTeam" value={appointment.CityTeam} onChange={handleInputChange} placeholder="Madrid" required />
        </label>

        <label>
          Championships
          <input name="championships" type="number" min="0" max="500" step="1" value={appointment.championships} onChange={handleInputChange} required />
        </label>

        <label>
          Who is the worst Player of your Team?
          <input name="worstPlayer" value={appointment.worstPlayer} onChange={handleInputChange} placeholder="Alan Shearer" required />
        </label>

      </div>


      <button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving info' : 'Submit'}
      </button>
    </form>
  );
};
