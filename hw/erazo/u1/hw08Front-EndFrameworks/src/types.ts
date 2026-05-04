export interface AppointmentData {
  _id?: string;
  patientName: string;
  therapistName: string;
  therapyType: string;
  appointmentDate: string;
  appointmentTime: string;
  durationMinutes: number;
  room: string;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled';
  patientPhone: string;
}
