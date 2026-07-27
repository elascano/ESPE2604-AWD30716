const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', productRoutes);

app.listen(PORT, () => {
    console.log(`Backend API running on http://localhost:${PORT}`);
});
