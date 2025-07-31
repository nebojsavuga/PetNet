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
            enum: ['Male', 'Female', 'Castrated Male', 'Sterilized Female', 'Unknown', 'Sterilized Unknown'],
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
        nftMintAddress: {
            type: String
        },
        nftUri: {
            type: String
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        parents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Pet',
            }
        ],
        children: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Pet',
            }
        ],
        awards: [
            {
                place: {
                    type: String,
                    enum: ['1st', '2nd', '3rd', 'Participated'],
                    required: true,
                },
                awardName: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: 100
                },
                showName: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: 100
                },
                date: {
                    type: Date,
                    required: true
                },
            },
        ],
        interventions: [
            {
                interventionName: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: 100
                },
                clinicName: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: 100
                },
                vetName: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: 100
                },
                date: {
                    type: Date,
                    required: true
                },
            },
        ],
        vaccinations: [
            {
                name: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: 100
                },
                timestamp: {
                    type: Date,
                    required: true
                },
                completed: {
                    type: Boolean,
                    required: true,
                    default: false
                },
            },
        ]
    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Pet', petSchema);
