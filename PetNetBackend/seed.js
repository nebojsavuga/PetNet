const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function seedUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await User.deleteMany({});
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
        process.exit(0);
    } catch (err) {
        console.error('Error seeding user:', err.message);
        process.exit(1);
    }
}

seedUser();