const Pet = require('../models/Pet');
require('dotenv').config();
const fs = require('fs');

const { pinata } = require('../config/pinata');

exports.uploadImageToIpfs = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const timestamp = Date.now();
        const randomFileName = `${timestamp}.jpg`;
        const blob = new Blob([fs.readFileSync(req.file.path)]);
        const file = new File([blob], randomFileName, { type: "image/jpeg" });

        const response = await pinata.upload.public.file(file);
        const url = await pinata.gateways.public.convert(response.cid);
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Failed to delete temp file:', err);
        });
        return res.status(200).json({ url });
    } catch (err) {
        console.error('Pinata upload error:', err);
        return res.status(500).json({ error: 'Failed to upload image to IPFS' });
    }
};

exports.create = async (req, res) => {
    try {
        const {
            name,
            gender,
            chipNumber,
            race,
            breed,
            dateOfBirth,
            imageUrl
        } = req.body;

        if (!name || !gender || !race || !breed || !dateOfBirth) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const pet = new Pet({
            name,
            gender,
            chipNumber,
            race,
            breed,
            dateOfBirth,
            imageUrl,
            owner: req.userId,
        });

        await pet.save();

        res.status(201).json({ message: 'Pet created successfully', pet });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getById = async (req, res) => {
    try {
        const pet = await Pet.findOne({ _id: req.params.id, owner: req.userId });

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found.' });
        }

        res.json(pet);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getAll = async (req, res) => {
    try {
        const pets = await Pet.find({ owner: req.userId });
        res.json(pets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};