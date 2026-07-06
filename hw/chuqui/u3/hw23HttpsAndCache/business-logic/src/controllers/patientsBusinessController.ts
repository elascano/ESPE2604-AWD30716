import { Request, Response } from 'express';

const API_BASE_URL = `http://${process.env.CRUD_API_IP}:3000/fabuladental/patients`;

const parseBirthday = (value: unknown): Date | null => {
  if (!value) {
    return null;
  }

  const rawValue = String(value).trim();
  const dateMatch = rawValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  const normalizedValue = dateMatch
    ? `${dateMatch[3]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[1].padStart(2, '0')}`
    : rawValue;
  const birthday = new Date(normalizedValue);

  if (Number.isNaN(birthday.getTime())) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (birthday > today) {
    return null;
  }

  return birthday;
};

const calculateAge = (birthday: Date) => {
  const today = new Date();
  let calculatedAgeYears = today.getFullYear() - birthday.getFullYear();
  let calculatedAgeMonths = today.getMonth() - birthday.getMonth();

  if (today.getDate() < birthday.getDate()) {
    calculatedAgeMonths--;
  }

  if (calculatedAgeMonths < 0) {
    calculatedAgeYears--;
    calculatedAgeMonths += 12;
  }

  const totalDays = Math.floor((today.getTime() - birthday.getTime()) / (1000 * 60 * 60 * 24));

  return { calculatedAgeYears, calculatedAgeMonths, totalDays };
};

const getClinicalCategory = (calculatedAgeYears: number, totalDays: number) => {
  if (totalDays <= 27) {
    return { pediatricCategory: 'Neonate', dosageRestrictionFactor: '0.1x' };
  }

  if (calculatedAgeYears < 1) {
    return { pediatricCategory: 'Infant', dosageRestrictionFactor: '0.2x' };
  }

  if (calculatedAgeYears < 4) {
    return { pediatricCategory: 'Toddler', dosageRestrictionFactor: '0.35x' };
  }

  if (calculatedAgeYears < 7) {
    return { pediatricCategory: 'Pre-schooler', dosageRestrictionFactor: '0.5x' };
  }

  if (calculatedAgeYears < 12) {
    return { pediatricCategory: 'School-age', dosageRestrictionFactor: '0.75x' };
  }

  if (calculatedAgeYears < 18) {
    return { pediatricCategory: 'Adolescent', dosageRestrictionFactor: '0.85x' };
  }

  return { pediatricCategory: 'Adult', dosageRestrictionFactor: '1.0x' };
};

export const calculatePatientPediatricCategory = async (req: Request, res: Response) => {
  try {
    const birthday = parseBirthday(req.body?.birthday ?? req.body?.dateOfBirth);

    if (!birthday) {
      return res.status(400).json({ error: "Valid birthday format required." });
    }

    const { calculatedAgeYears, calculatedAgeMonths, totalDays } = calculateAge(birthday);
    const { pediatricCategory, dosageRestrictionFactor } = getClinicalCategory(calculatedAgeYears, totalDays);

    return res.status(200).json({
      calculatedAgeYears,
      calculatedAgeMonths,
      pediatricCategory,
      dosageRestrictionFactor
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal processing error calculating clinical category." });
  }
};

export const validateLegalRepresentative = async (req: Request, res: Response) => {
  try {
    const birthday = parseBirthday(req.body?.birthday ?? req.body?.dateOfBirth);
    const legalRep = req.body?.legalRepresentative || "";

    if (!birthday) {
      return res.status(400).json({ error: "Valid birthday format required." });
    }

    const { calculatedAgeYears } = calculateAge(birthday);

    if (calculatedAgeYears < 18 && legalRep.trim().length === 0) {
      return res.status(400).json({ error: "Patient is underage, legal representative is required." });
    }

    return res.status(200).json({
      valid: true,
      requiresLegalRepresentative: calculatedAgeYears < 18,
      message: calculatedAgeYears >= 18 ? "Legal representative not required." : "Legal representative provided successfully."
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal processing error validating legal representative." });
  }
};

export const calculateDaysToBirthday = async (req: Request, res: Response) => {
  try {
    const birthday = parseBirthday(req.body?.birthday ?? req.body?.dateOfBirth);

    if (!birthday) {
      return res.status(400).json({ error: "Valid birthday format required." });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
    
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = Math.abs(nextBirthday.getTime() - today.getTime());
    const daysUntilBirthday = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isBirthdayWeek = daysUntilBirthday <= 7;

    return res.status(200).json({
      daysUntilBirthday,
      isBirthdayWeek
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal processing error calculating days to birthday." });
  }
};

export const calculateSeniorDiscount = async (req: Request, res: Response) => {
  try {
    const birthday = parseBirthday(req.body?.birthday ?? req.body?.dateOfBirth);

    if (!birthday) {
      return res.status(400).json({ error: "Valid birthday format required." });
    }

    const { calculatedAgeYears } = calculateAge(birthday);
    const suggestedDiscountFactor = calculatedAgeYears >= 65 ? 0.50 : 0.00;

    return res.status(200).json({
      suggestedDiscountFactor,
      isEligibleForDiscount: calculatedAgeYears >= 65
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal processing error calculating senior discount." });
  }
};

export const estimateConsultationTime = async (req: Request, res: Response) => {
  try {
    const birthday = parseBirthday(req.body?.birthday ?? req.body?.dateOfBirth);
    const reason = req.body?.reasonForConsultation || "";

    if (!birthday) {
      return res.status(400).json({ error: "Valid birthday format required." });
    }

    const { calculatedAgeYears } = calculateAge(birthday);
    
    let estimatedConsultationMinutes = 15;

    if (calculatedAgeYears < 5 || calculatedAgeYears > 70) {
      estimatedConsultationMinutes += 10;
    }

    if (reason.length > 50) {
      estimatedConsultationMinutes += 10;
    }

    return res.status(200).json({
      estimatedConsultationMinutes,
      baseMinutes: 15
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal processing error estimating consultation time." });
  }
};

export const calculateContactPriority = async (req: Request, res: Response) => {
  try {
    const phone = req.body?.phone || "";
    const reason = req.body?.reasonForConsultation || "";

    let contactPriorityScore = 0;

    if (phone.length >= 10) {
      contactPriorityScore += 10;
    }

    const urgentKeywords = ["dolor", "urgencia", "sangrado", "emergencia"];
    const reasonLower = reason.toLowerCase();
    
    const hasUrgentKeywords = urgentKeywords.some(keyword => reasonLower.includes(keyword));
    
    if (hasUrgentKeywords) {
      contactPriorityScore += 50;
    }

    return res.status(200).json({
      contactPriorityScore,
      requiresImmediateAttention: contactPriorityScore >= 50
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal processing error calculating contact priority." });
  }
};