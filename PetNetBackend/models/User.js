const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        email: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },
        phoneNumber: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
            maxlength: 20,
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
                trim: true,
                maxlength: 200,
            },
            latitude: {
                type: Number,
                required: true,
                min: -90,
                max: 90,
            },
            longitude: {
                type: Number,
                required: true,
                min: -180,
                max: 180,
            },
        },
        walletAddress: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxlength: 100,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);
