const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

//Database
connectDB();

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Post /api/auth/login -> Logging to the system`);
    console.log(`Post /api/auth/register -> Registering tothe system`);
});