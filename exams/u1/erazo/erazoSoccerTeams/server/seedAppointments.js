import { Appointment } from './appointmentModel.js';

const starterAppointments = [{
    userName: 'Emma Carter',
    soccerTeamName: 'Barca',
    bestPlayerOAT: 'Ivan Kaviedes',
    rivalTeam: 'Real Madrid',
    CityTeam: 'Barcelona',
    championships: 45,
    worstPlayer: 'Braithwathe',

}];

export const seedAppointments = async() => {
    const appointmentCount = await Appointment.countDocuments();

    if (appointmentCount === 0) {
        await Appointment.insertMany(starterAppointments);
    }
};