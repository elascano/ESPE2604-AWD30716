const express = require('express');
const { addCustomer } = require('./src/controller/addCustomer');

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Set up the POST route to add a customer
app.post('/api/customers', addCustomer);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
