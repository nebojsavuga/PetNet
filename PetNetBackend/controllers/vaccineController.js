const jwt = require('jsonwebtoken')
const Vaccine = require('../models/Vaccine')
require('dotenv').config()


exports.getAll = async (req, res) => {
    try {
        const vaccines = await Vaccine.find({});

        if (!vaccines) return res.status(404).json({ error: 'Vaccines not found' });

        return res.status(200).json({ vaccines: vaccines });
    } catch (error) {
        console.error("Internal server error");
        return res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getVaccineById = async (req, res) => {
    try {
        const vaccine = await Vaccine.findById(req.params.id);
        if (!vaccine) return res.status(404).json({ error: 'Vaccine not found' });
        return res.status(200).json({ vaccine });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};