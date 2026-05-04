const prisma = require('./db')

class BaseModel {
    constructor(modelName) {
        this.modelName = modelName;
        this.model = prisma[modelName];
        if (!this.model) {
            throw new Error(`Model ${modelName} not found in Prisma Client`);
        }
    }

    async findAll(where = {}) {
        return await this.model.findMany({ where });
    }

    async findById(id) {
        return await this.model.findUnique({ where: { id } });
    }

    async create(data) {
        return await this.model.create({ data });
    }

    async update(id, data) {
        return await this.model.update({
            where: { id },
            data
        });
    }

    async delete(id) {
        return await this.model.delete({
            where: { id }
        });
    }
}

module.exports = BaseModel;
