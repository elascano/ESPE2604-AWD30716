import { useEffect, useState } from 'react';
import './App.css';
import { AppointmentForm } from './AppointmentForm';
import { AppointmentTable } from './AppointmentTable';
import type { AppointmentData } from './types';

const API_URL = '/api/appointments';

function App() {
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Appointments could not be loaded');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      setNotification({ message: error instanceof Error ? error.message : 'Connection error', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadAppointments();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleCreateAppointment = async (appointment: AppointmentData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      });

      if (!response.ok) {
        throw new Error('Appointment could not be saved');
      }

      setNotification({ message: 'Appointment saved successfully', type: 'success' });
      await loadAppointments();
    } catch (error) {
      setNotification({ message: error instanceof Error ? error.message : 'Server connection error', type: 'error' });
    } finally {
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <main className="app-shell">
      <section className="hero-section">
        <div>
          <span className="eyebrow">Physiotherapy center</span>
          <h1>Appointment dashboard</h1>
          <p>Organize therapy sessions, rooms, specialists, and patient contact details from one connected MongoDB table.</p>
        </div>
        <div className="summary-panel">
          <span>Total appointments</span>
          <strong>{appointments.length}</strong>
        </div>
      </section>

      {notification && <div className={`notification ${notification.type}`}>{notification.message}</div>}

      <section className="content-grid">
        <AppointmentForm onCreateAppointment={handleCreateAppointment} />
        <section className="appointments-panel">
          <div className="section-heading">
            <span>MongoDB records</span>
            <h2>Scheduled appointments</h2>
          </div>
          <AppointmentTable appointments={appointments} isLoading={isLoading} />
        </section>
      </section>
    </main>
  );
}

export default App;
