const express = require('express');
const cors = require('cors');
require('dotenv').config();

const computationsRoutes = require('./routes/computationsRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/shopDavid/computations', computationsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Operations API running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Operations] Server running on http://localhost:${PORT}`);
});
