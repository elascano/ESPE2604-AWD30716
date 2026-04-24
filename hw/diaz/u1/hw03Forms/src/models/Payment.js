const { getDb } = require('../utils/database');

class Payment {
    constructor(patientId, paymentAmount, paymentDate, paymentMethod) {
        this.patientId = patientId;
        this.paymentAmount = paymentAmount;
        this.paymentDate = paymentDate;
        this.paymentMethod = paymentMethod;
    }

    async save() {
        const db = getDb();
        const result = await db.collection('payments').insertOne(this);
        return result;
    }

    static async fetchAll() {
        const db = getDb();
        return await db.collection('payments').find().toArray();
    }
}

module.exports = Payment;
