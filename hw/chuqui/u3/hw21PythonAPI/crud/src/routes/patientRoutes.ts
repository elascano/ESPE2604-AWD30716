import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../db';

const patientRouter = Router();

type PatientPayload = {
  patientID?: string | number;
  fullName?: string;
  birthday?: string;
  phone?: string;
  gender?: string;
  reasonForConsultation?: string;
  legalRepresentative?: string;
};

const validGenders = ['masculino', 'femenino', 'otro', 'male', 'female', 'other'];

function parsePatientId(value: unknown): bigint | null {
  if (value === undefined || value === null || String(value).trim() === '') {
    return null;
  }

  try {
    return BigInt(String(value));
  } catch {
    return null;
  }
}

function parseBirthday(value: unknown): Date | null {
  if (!value) {
    return null;
  }

  const rawValue = String(value).trim();
  const dateMatch = rawValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  const day = dateMatch?.[1];
  const month = dateMatch?.[2];
  const year = dateMatch?.[3];
  const normalizedValue = dateMatch
    ? `${year}-${month?.padStart(2, '0')}-${day?.padStart(2, '0')}`
    : rawValue;
  const date = new Date(normalizedValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date > today) {
    return null;
  }

  return date;
}

function getAgeParts(birthday: Date) {
  const today = new Date();
  let years = today.getFullYear() - birthday.getFullYear();
  let months = today.getMonth() - birthday.getMonth();

  if (today.getDate() < birthday.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.floor((today.getTime() - birthday.getTime()) / (1000 * 60 * 60 * 24));

  return { years, months, totalDays };
}



function validatePatientPayload(payload: PatientPayload, requirePatientId: boolean) {
  const patientID = parsePatientId(payload.patientID);
  const fullName = payload.fullName?.trim();
  const phone = payload.phone?.trim();
  const gender = payload.gender?.trim();
  const reasonForConsultation = payload.reasonForConsultation?.trim();
  const legalRepresentative = payload.legalRepresentative?.trim();
  const birthday = parseBirthday(payload.birthday);

  if (requirePatientId && patientID === null) {
    return null;
  }

  if (
    !fullName ||
    fullName.length < 3 ||
    !birthday ||
    !phone ||
    !/^[0-9]{10}$/.test(phone) ||
    !gender ||
    !validGenders.includes(gender.toLowerCase()) ||
    !reasonForConsultation ||
    reasonForConsultation.length < 5
  ) {
    return null;
  }

  const { years } = getAgeParts(birthday);
  if (years < 18 && !legalRepresentative) {
    return null;
  }

  return {
    patientID,
    fullName,
    birthday,
    phone,
    gender,
    reasonForConsultation,
    legalRepresentative,
  };
}

patientRouter.post('/patients', async (req: Request, res: Response) => {
  try {
    const patient = validatePatientPayload(req.body, true);
    if (!patient || patient.patientID === null) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    await prisma.patients.create({
      data: {
        patientID: patient.patientID,
        fullName: patient.fullName,
        birthday: patient.birthday,
        phone: patient.phone,
        gender: patient.gender,
        reasonForConsultation: patient.reasonForConsultation,
        legalRepresentative: patient.legalRepresentative ?? null,
      },
    });

    return res.status(201).json({ success: true, message: "Patient registered successfully" });
  } catch {
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
});

patientRouter.get('/patients', async (req: Request, res: Response) => {
  try {
    const patients = await prisma.patients.findMany();
    return res.status(200).json(patients);
  } catch {
    return res.status(400).json({ error: "Unable to fetch patients." });
  }
});

patientRouter.get('/patients/:patientId', async (req: Request, res: Response) => {
  try {
    const patientID = parsePatientId(req.params.patientId);
    if (patientID === null) {
      return res.status(400).json({ error: "Patient ID is required." });
    }

    const patient = await prisma.patients.findUnique({
      where: { patientID },
    });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    return res.status(200).json(patient);
  } catch {
    return res.status(500).json({ error: "Unable to fetch patient." });
  }
});

patientRouter.put('/patients/:patientId', async (req: Request, res: Response) => {
  try {
    const patientID = parsePatientId(req.params.patientId);
    if (patientID === null) {
      return res.status(400).json({ error: "Patient ID is required." });
    }

    const patient = validatePatientPayload({ ...req.body, patientID }, false);
    if (!patient) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    await prisma.patients.update({
      where: { patientID },
      data: {
        fullName: patient.fullName,
        birthday: patient.birthday,
        phone: patient.phone,
        gender: patient.gender,
        reasonForConsultation: patient.reasonForConsultation,
        legalRepresentative: patient.legalRepresentative ?? null,
      },
    });

    return res.status(200).json({ success: true, message: "Patient updated" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ error: "Patient not found." });
    }

    return res.status(500).json({ error: "Something went wrong." });
  }
});

patientRouter.delete('/patients/:patientId', async (req: Request, res: Response) => {
  try {
    const patientID = parsePatientId(req.params.patientId);
    if (patientID === null) {
      return res.status(400).json({ error: "Invalid or missing patient ID." });
    }

    await prisma.patients.delete({
      where: { patientID },
    });

    return res.status(200).json({ success: true, message: "Patient deleted" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ error: "Patient not found." });
    }

    return res.status(500).json({ error: "Deletion failed." });
  }
});

export default patientRouter;
