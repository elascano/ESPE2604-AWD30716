const Payment = require('../models/Payment');

exports.createPayment = async (req, res) => {
    try {
        const { patientId, paymentAmount, paymentDate, paymentMethod } = req.body;
        const payment = new Payment(patientId, paymentAmount, paymentDate, paymentMethod);
        const result = await payment.save();
        res.status(201).json({ message: "Abono registrado exitosamente", result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error al registrar el abono" });
    }
};

exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.fetchAll();
        res.status(200).json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ocurrió un error al obtener abonos" });
    }
};
