import { Router } from 'express';
import { Appointment } from './appointmentModel.js';

export const appointmentRouter = Router();

appointmentRouter.get('/', async (_request, response) => {
  const appointments = await Appointment.find().sort({ appointmentDate: 1, appointmentTime: 1 });
  response.json(appointments);
});

appointmentRouter.post('/', async (request, response) => {
  const appointment = await Appointment.create(request.body);
  response.status(201).json(appointment);
});
