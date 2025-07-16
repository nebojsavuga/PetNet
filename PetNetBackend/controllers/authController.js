const jwt = require('jsonwebtoken')
const User = require('../models/User')
require('dotenv').config()

exports.login = async (req, res) => {
    const { walletAddress } = req.body;
    if (!walletAddress) {
        return res.status(400).json({ error: 'Wallet address is required' });
    }

    try {
        let user = await User.findOne({ walletAddress });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const token = jwt.sign(
            { userId: user._id, walletAddress: user.walletAddress },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({ token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.register = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phoneNumber,
            verificationType,
            addressString,
            latitude,
            longitude,
            walletAddress
        } = req.body;
        if (
            !fullName ||
            !verificationType ||
            !['email', 'phone'].includes(verificationType) ||
            !addressString ||
            latitude === undefined ||
            longitude === undefined ||
            !walletAddress
        ) {
            return res.status(400).json({ error: 'Missing or invalid fields' });
        }

        const existingUser = await User.findOne({
            $or: [
                { walletAddress },
                ...(email ? [{ email }] : []),
                ...(phoneNumber ? [{ phoneNumber }] : [])
            ]
        });

        if (existingUser) {
            return res.status(409).json({ error: 'User already exists with that wallet/email/phone' });
        }

        const user = new User({
            fullName,
            email,
            phoneNumber,
            verificationType,
            address: {
                addressString,
                latitude,
                longitude
            },
            walletAddress
        });

        await user.save();

        return res.status(201).json({ message: 'User registered successfully.', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}