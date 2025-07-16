const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

//Database
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('\nAuth methods\n');
    console.log(`Post /api/auth/login -> Logging to the system`);
    console.log(`Post /api/auth/register -> Registering tothe system`);

    console.log('\nPet methods\n');
    console.log(`Post /api/pets -> Creates pet`);
    console.log(`Get /api/pets -> Gets all pets for user`);
    console.log(`Get /api/pets/:id -> Gets single pet for user\n`);
    console.log(`Get /api/pets/family -> Gets family info\n`);
});