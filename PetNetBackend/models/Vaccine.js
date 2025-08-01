const mongoose = require('mongoose');

const vaccineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            maxlength: 100
        },
        isMandatory: {
            type: Boolean,
            required: true,
            default: false
        },
        revaccinationPeriod: {
            type: Number, // in days
            required: true
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Vaccine', vaccineSchema);