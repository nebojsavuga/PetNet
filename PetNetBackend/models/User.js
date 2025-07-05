const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            sparse: true,
        },
        phoneNumber: {
            type: String,
            unique: true,
            sparse: true,
        },
        verificationType: {
            type: String,
            enum: ['email', 'phone'],
            required: true,
        },
        address: {
            addressString: {
                type: String,
                required: true,
            },
            latitude: {
                type: Number,
                required: true,
            },
            longitude: {
                type: Number,
                required: true,
            },
        },
        walletAddress: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        // mongo automatically adds createdAt i updatedAt
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);
