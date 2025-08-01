const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Pet = require('./models/Pet');
const Vaccine = require('./models/Vaccine');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await User.deleteMany({});
        await Pet.deleteMany({});
        await Vaccine.deleteMany({});

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
            walletAddress: '3XFKoAdCCNPxToXCz2sLfHFzwRybANfBMTSGsur4oAHP',
        });

        await user.save();
        console.log('User seeded.');

        // const buddy = new Pet({
        //     name: 'Buddy',
        //     gender: 'Male',
        //     chipNumber: 'CHIP123456789',
        //     race: 'Dog',
        //     breed: 'Golden Retriever',
        //     dateOfBirth: new Date('2020-06-15'),
        //     imageUrl: 'https://cdn.sanity.io/images/4ij0poqn/production/da89d930fc320dd912a2a25487b9ca86b37fcdd6-800x600.jpg',
        //     owner: user._id,
        //     awards: [
        //         {
        //             awardName: 'Best Junior Dog',
        //             showName: 'National Dog Show 2022',
        //             date: new Date('2022-08-10'),
        //             place: '1st'
        //         },
        //     ],
        //     vaccinations: [
        //         {
        //             name: 'Rabies',
        //             timestamp: new Date('2024-08-15'),
        //             completed: false,
        //         },
        //     ],
        //     interventions: [
        //         {
        //             interventionName: 'Neutering',
        //             clinicName: 'Happy Paws Veterinary Clinic',
        //             vetName: 'Dr. Ana Markovic',
        //             date: new Date('2021-03-12'),
        //         },
        //         {
        //             interventionName: 'Dental Cleaning',
        //             clinicName: 'Healthy Pets Clinic',
        //             vetName: 'Dr. Luka Petrovic',
        //             date: new Date('2023-10-05'),
        //         },
        //     ]
        // });

        // const max = new Pet({
        //     name: 'Max',
        //     gender: 'Male',
        //     chipNumber: 'CHIP987654321',
        //     race: 'Dog',
        //     breed: 'Labrador Retriever',
        //     dateOfBirth: new Date('2021-01-10'),
        //     imageUrl: 'https://images.dog.ceo/breeds/labrador/n02099712_1577.jpg',
        //     owner: user._id,
        // });

        // await buddy.save();
        // await max.save();
        // console.log('Buddy and Max seeded.');

        // const luna = new Pet({
        //     name: 'Luna',
        //     gender: 'Female',
        //     chipNumber: 'CHIP555888999',
        //     race: 'Dog',
        //     breed: 'German Shepherd',
        //     dateOfBirth: new Date('2019-11-25'),
        //     imageUrl: 'https://images.dog.ceo/breeds/germanshepherd/n02106662_1870.jpg',
        //     owner: user._id,
        //     children: [buddy._id, max._id],
        // });

        // await luna.save();
        // console.log('Luna seeded with Buddy and Max as children.');

        const vaccines = [
            // Mandatory
            { name: 'Rabies', isMandatory: true, revaccinationPeriod: 365 },
            { name: 'Canine Distemper', isMandatory: true, revaccinationPeriod: 365 },
            { name: 'Canine Parvovirus', isMandatory: true, revaccinationPeriod: 365 },
            { name: 'Canine Adenovirus (Hepatitis)', isMandatory: true, revaccinationPeriod: 365 },

            // Optional
            { name: 'Bordetella (Kennel Cough)', isMandatory: false, revaccinationPeriod: 180 },
            { name: 'Lyme Disease', isMandatory: false, revaccinationPeriod: 365 },
            { name: 'Leptospirosis', isMandatory: false, revaccinationPeriod: 365 },
            { name: 'Canine Influenza', isMandatory: false, revaccinationPeriod: 365 }
        ];

        await Vaccine.insertMany(vaccines);
        console.log('Vaccines seeded.');

        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err.message);
        process.exit(1);
    }
}

seed();
