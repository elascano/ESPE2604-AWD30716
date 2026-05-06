import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true, trim: true },
    therapistName: { type: String, required: true, trim: true },
    therapyType: { type: String, required: true, trim: true },
    appointmentDate: { type: String, required: true, trim: true },
    appointmentTime: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 20, max: 120 },
    room: { type: String, required: true, trim: true },
    status: { type: String, required: true, enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled'], default: 'Scheduled' },
    patientPhone: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const Appointment = mongoose.model('Appointment', appointmentSchema);
