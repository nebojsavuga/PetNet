const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function seedUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

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
            walletAddress: 'abcdabcdabcd',
        });

        await user.save();
        console.log('User seeded:', user);
        process.exit(0);
    } catch (err) {
        console.error('Error seeding user:', err.message);
        process.exit(1);
    }
}

seedUser();