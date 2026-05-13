import mongoose from 'mongoose';



const appointmentSchema = new mongoose.Schema({
    userName: { type: String, required: true, trim: true },
    soccerTeamName: { type: String, required: true, trim: true },
    bestPlayerOAT: { type: String, required: true, trim: true },
    rivalTeam: { type: String, required: true, trim: true },
    CityTeam: { type: String, required: true, trim: true },
    championships: { type: Number, required: true, min: 20, max: 120 },
    worstPlayer: { type: String, required: true, trim: true },
}, { timestamps: true }, );

export const Appointment = mongoose.model('Appointment', appointmentSchema);