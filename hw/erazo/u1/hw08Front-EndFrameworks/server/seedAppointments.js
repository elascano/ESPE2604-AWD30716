import { Appointment } from './appointmentModel.js';

const starterAppointments = [
  {
    patientName: 'Emma Carter',
    therapistName: 'Dr. Noah Bennett',
    therapyType: 'Sports Rehabilitation',
    appointmentDate: '2026-05-06',
    appointmentTime: '09:00',
    durationMinutes: 45,
    room: 'Room A',
    status: 'Confirmed',
    patientPhone: '+1 555 0134',
  },
  {
    patientName: 'Liam Brooks',
    therapistName: 'Dr. Ava Mitchell',
    therapyType: 'Postoperative Recovery',
    appointmentDate: '2026-05-06',
    appointmentTime: '10:30',
    durationMinutes: 60,
    room: 'Mobility Lab',
    status: 'Scheduled',
    patientPhone: '+1 555 0177',
  },
  {
    patientName: 'Sophia Reed',
    therapistName: 'Dr. Ethan Hayes',
    therapyType: 'Back Pain Treatment',
    appointmentDate: '2026-05-07',
    appointmentTime: '14:00',
    durationMinutes: 50,
    room: 'Room B',
    status: 'Completed',
    patientPhone: '+1 555 0192',
  },
  {
    patientName: 'Mason Price',
    therapistName: 'Dr. Mia Foster',
    therapyType: 'Neurological Therapy',
    appointmentDate: '2026-05-08',
    appointmentTime: '11:15',
    durationMinutes: 55,
    room: 'Hydrotherapy Suite',
    status: 'Confirmed',
    patientPhone: '+1 555 0108',
  },
];

export const seedAppointments = async () => {
  const appointmentCount = await Appointment.countDocuments();

  if (appointmentCount === 0) {
    await Appointment.insertMany(starterAppointments);
  }
};
