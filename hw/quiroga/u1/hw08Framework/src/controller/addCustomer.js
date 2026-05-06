require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Express.js route handler to add a customer
 */
async function addCustomer(req, res) {
    const { id, name, password } = req.body;

    if (!id || !name || !password) {
        return res.status(400).send("Please fill in all fields.");
    }

    try {
        // Hash the password (equivalent to password_hash with PASSWORD_BCRYPT in PHP)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const customer = await prisma.customer.create({
            data: {
                id: String(id),
                name: String(name),
                password: hashedPassword
            }
        });
        
        return res.status(201).send(`Customer added successfully with Supabase ID: ${customer.id}`);
    } catch (error) {
        console.error("Error connecting to Supabase database:", error);
        return res.status(500).send(`Error connecting to Supabase: ${error.message}`);
    }
}

module.exports = { addCustomer };