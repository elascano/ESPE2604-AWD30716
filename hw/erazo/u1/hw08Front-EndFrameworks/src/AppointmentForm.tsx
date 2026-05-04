import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { AppointmentData } from './types';

interface AppointmentFormProps {
  onCreateAppointment: (appointment: AppointmentData) => Promise<void>;
}

const emptyAppointment: AppointmentData = {
  patientName: '',
  therapistName: '',
  therapyType: 'Sports Rehabilitation',
  appointmentDate: '',
  appointmentTime: '',
  durationMinutes: 45,
  room: 'Room A',
  status: 'Scheduled',
  patientPhone: '',
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
        <span>New appointment</span>
        <h2>Schedule physiotherapy care</h2>
      </div>

      <div className="form-grid">
        <label>
          Patient
          <input name="patientName" value={appointment.patientName} onChange={handleInputChange} placeholder="Emma Carter" required />
        </label>

        <label>
          Therapist
          <input name="therapistName" value={appointment.therapistName} onChange={handleInputChange} placeholder="Dr. Noah Bennett" required />
        </label>

        <label>
          Therapy type
          <select name="therapyType" value={appointment.therapyType} onChange={handleInputChange}>
            <option>Sports Rehabilitation</option>
            <option>Postoperative Recovery</option>
            <option>Neurological Therapy</option>
            <option>Back Pain Treatment</option>
            <option>Mobility Assessment</option>
          </select>
        </label>

        <label>
          Date
          <input name="appointmentDate" type="date" value={appointment.appointmentDate} onChange={handleInputChange} required />
        </label>

        <label>
          Time
          <input name="appointmentTime" type="time" value={appointment.appointmentTime} onChange={handleInputChange} required />
        </label>

        <label>
          Duration
          <input name="durationMinutes" type="number" min="20" max="120" step="5" value={appointment.durationMinutes} onChange={handleInputChange} required />
        </label>

        <label>
          Room
          <select name="room" value={appointment.room} onChange={handleInputChange}>
            <option>Room A</option>
            <option>Room B</option>
            <option>Hydrotherapy Suite</option>
            <option>Mobility Lab</option>
          </select>
        </label>

        <label>
          Phone
          <input name="patientPhone" value={appointment.patientPhone} onChange={handleInputChange} placeholder="+1 555 0188" required />
        </label>
      </div>

      <button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving appointment' : 'Add appointment'}
      </button>
    </form>
  );
};
