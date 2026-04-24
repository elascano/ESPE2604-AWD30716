const Patient = require('../models/Patient');

exports.createPatient = async (req, res) => {
    try {
        const { nombre, cedula, fecha, telefono, correo, genero, motivo } = req.body;
        const patient = new Patient(nombre, cedula, fecha, telefono, correo, genero, motivo);
        const result = await patient.save();
        res.status(201).json({ message: "Paciente creado exitosamente", result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error al crear el paciente" });
    }
};

exports.getPatients = async (req, res) => {
    try {
        const patients = await Patient.fetchAll();
        res.status(200).json(patients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error al obtener pacientes" });
    }
};
