const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Castrated Male', 'Sterilized Female', 'Unknown'],
            required: true,
        },
        chipNumber: {
            type: String,
            unique: true,
            sparse: true,
            maxlength: 50,
        },
        race: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
        },
        breed: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        dateOfBirth: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    const minDate = new Date('1900-01-01');
                    const now = new Date();
                    return value >= minDate && value <= now;
                },
                message: 'Date of birth must be between 1900 and today.',
            },
        },
        imageUrl: {
            type: String
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        fatherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pet',
            default: null,
        },
        motherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pet',
            default: null,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Pet', petSchema);
