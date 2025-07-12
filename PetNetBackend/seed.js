const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Pet = require('./models/Pet')

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await User.deleteMany({});
        await Pet.deleteMany({});

        const user = new User({
            fullName: 'Nebojsa Vuga',
            email: 'nebojsavuga01@gmail.com',
            phoneNumber: '+55412',
            verificationType: 'email',
            address: {
                addressString: '1 Novembar 35, Lacarak',
                latitude: 44.998617,
                longitude: 19.563195
            },
            walletAddress: '2kPDhXqAuGGUinUx2se1qkF7qM5N8btwuHKgQdZHYmwK',
        });

        await user.save();
        console.log('User seeded.');

        const pet = new Pet({
            name: 'Buddy',
            gender: 'Male',
            chipNumber: 'CHIP123456789',
            race: 'Dog',
            breed: 'Golden Retriever',
            dateOfBirth: new Date('2020-06-15'),
            imageUrl: 'https://your-ipfs-gateway.com/ipfs/Qm...Hash',
            owner: user._id,
            awards: [
                {
                    awardName: 'Best Junior Dog',
                    showName: 'National Dog Show 2022',
                    date: new Date('2022-08-10'),
                },
            ],
            vaccinations: [
                {
                    name: 'Rabies',
                    timestamp: new Date('2024-01-15'),
                    nextDue: new Date('2025-01-15'),
                    completed: true,
                },
            ],
            interventions: [
                {
                    interventionName: 'Neutering',
                    clinicName: 'Happy Paws Veterinary Clinic',
                    vetName: 'Dr. Ana Markovic',
                    date: new Date('2021-03-12'),
                },
                {
                    interventionName: 'Dental Cleaning',
                    clinicName: 'Healthy Pets Clinic',
                    vetName: 'Dr. Luka Petrovic',
                    date: new Date('2023-10-05'),
                },
            ]
        });

        await pet.save();
        console.log('Pet seeded.');

        process.exit(0);
    } catch (err) {
        console.error('Error seeding user:', err.message);
        process.exit(1);
    }
}

seed();