const { getDb } = require('../utils/database');

class Patient {
    constructor(nombre, cedula, fecha, telefono, correo, genero, motivo) {
        this.nombre = nombre;
        this.cedula = cedula;
        this.fecha = fecha;
        this.telefono = telefono;
        this.correo = correo;
        this.genero = genero;
        this.motivo = motivo;
    }

    async save() {
        const db = getDb();
        const result = await db.collection('patients').insertOne(this);
        return result;
    }

    static async fetchAll() {
        const db = getDb();
        return await db.collection('patients').find().toArray();
    }
}

module.exports = Patient;
