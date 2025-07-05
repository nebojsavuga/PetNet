const express = require('express');
// TODO
//const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// TODO
// app.use(cors({
//     origin: process.env.ORIGIN,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));
app.use(express.json());

//Database
connectDB();

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Post /api/auth/login -> Logging to the system`);
    console.log(`Post /api/auth/register -> Registering tothe system`);
});