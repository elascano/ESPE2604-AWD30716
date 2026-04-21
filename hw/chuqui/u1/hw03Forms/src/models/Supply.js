const { getDb } = require('../utils/database');

class Supply {
    constructor(productName, productCode, productInitialQuantity, productUnitCost, productPurchaseDate, productExpirationDate) {
        this.productName = productName;
        this.productCode = productCode;
        this.productInitialQuantity = productInitialQuantity;
        this.productUnitCost = productUnitCost;
        this.productPurchaseDate = productPurchaseDate;
        this.productExpirationDate = productExpirationDate;
    }

    async save() {
        const db = getDb();
        const result = await db.collection('supplies').insertOne(this);
        return result;
    }

    static async fetchAll() {
        const db = getDb();
        return await db.collection('supplies').find().toArray();
    }
}

module.exports = Supply;
