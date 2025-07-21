const Pet = require('../models/Pet');
require('dotenv').config();
const fs = require('fs');
const bs58 = require("bs58");
const {
    Connection,
    Keypair,
    clusterApiUrl,
} = require("@solana/web3.js");
const {
    Metaplex,
    keypairIdentity,
    bundlrStorage,
} = require("@metaplex-foundation/js");

const { pinata } = require('../config/pinata');


exports.uploadImageToIpfs = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const timestamp = Date.now();
        const randomFileName = `${timestamp}.jpg`;
        const blob = new Blob([fs.readFileSync(req.file.path)]);
        const file = new File([blob], randomFileName, { type: "image/jpeg" });

        const response = await pinata.upload.public.file(file);
        const url = await pinata.gateways.public.convert(response.cid);
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Failed to delete temp file:', err);
        });
        return res.status(200).json({ url });
    } catch (err) {
        console.error('Pinata upload error:', err);
        return res.status(500).json({ error: 'Failed to upload image to IPFS' });
    }
};

exports.create = async (req, res) => {
    try {
        const {
            name,
            gender,
            chipNumber,
            race,
            breed,
            dateOfBirth,
            imageUrl
        } = req.body;
        if (!name || !gender || !race || !breed || !dateOfBirth) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const pet = new Pet({
            name,
            gender,
            chipNumber,
            race,
            breed,
            dateOfBirth,
            imageUrl,
            owner: req.userId,
        });

        await pet.save();

        const secretKey = bs58.decode(process.env.SOLANA_SECRET_KEY);
        const wallet = Keypair.fromSecretKey(secretKey);
        const connection = new Connection(clusterApiUrl(process.env.SOLANA_CLUSTER), "confirmed");
        const metaplex = Metaplex.make(connection)
            .use(keypairIdentity(wallet))
            .use(bundlrStorage());
        const metadata = {
            name: `${name}'s Pet Passport`,
            symbol: 'PET',
            description: `NFT Passport for ${name}, the ${breed}.`,
            image: imageUrl,
            attributes: [
                { trait_type: "Gender", value: gender },
                { trait_type: "Breed", value: breed },
                { trait_type: "Race", value: race },
                { trait_type: "Chip Number", value: chipNumber },
                { trait_type: "Date of Birth", value: dateOfBirth }
            ]
        };
        const response = await pinata.upload.public.json(metadata);
        const metadataUrl = await pinata.gateways.public.convert(response.cid);
        const { nft } = await metaplex.nfts().create({
            uri: metadataUrl,
            name: metadata.name,
            sellerFeeBasisPoints: 0,
            symbol: metadata.symbol,
            creators: [
                {
                    address: wallet.publicKey,
                    share: 100
                }
            ]
        });
        pet.nftMintAddress = nft.address.toBase58();
        pet.nftUri = metadataUrl;

        await pet.save();

        res.status(201).json({ message: 'Pet created successfully', pet });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getById = async (req, res) => {
    try {
        const pet = await Pet.findOne({ _id: req.params.id, owner: req.userId });

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found.' });
        }

        res.json(pet);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getAll = async (req, res) => {
    try {
        const pets = await Pet.find({ owner: req.userId });
        res.json(pets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getFamily = async (req, res) => {
    try {
        const pet = await Pet.findOne({ _id: req.params.id, owner: req.userId });
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found.' });
        }
        let mother = null;
        let father = null;
        if (pet.motherId != null) {
            mother = await Pet.findOne({ _id: pet.motherId });
        }
        if (pet.fatherId != null) {
            father = await Pet.findOne({ _id: pet.fatherId });
        }

        const children = await Pet.find({
            $or: [
                { fatherId: req.params.id },
                { motherId: req.params.id }
            ]
        });

        res.json({
            mother,
            father,
            children
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createOrUpdateVaccination = async (req, res) => {
    try {
        const {
            vaccinationId,
            name,
            date,
            completed
        } = req.body;
        const pet = await Pet.findOne({ _id: req.params.id, owner: req.userId });

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found.' });
        }
        const vaccinationDate = date ? new Date(date) : new Date();
        const isCompleted = completed ?? false;
        const existingVaccinationIndex = pet.vaccinations.findIndex(vac => vac._id === vaccinationId);
        if (existingVaccinationIndex !== -1) {
            pet.vaccinations[existingVaccinationIndex].completed = isCompleted;
            pet.vaccinations[existingVaccinationIndex].name = name;
        } else {
            pet.vaccinations.push({
                name,
                timestamp: vaccinationDate,
                completed: isCompleted
            });
        }
        await pet.save();

        res.status(201).json({ message: 'Pet vaccination created successfully', pet });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createOrUpdateIntervention = async (req, res) => {
    try {
        const {
            interventionId,
            interventionName,
            clinicName,
            vetName,
            date
        } = req.body;
        const pet = await Pet.findOne({ _id: req.params.id, owner: req.userId });

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found.' });
        }
        const interventionDate = date ? new Date(date) : new Date();
        const existingIntervention = pet.interventions.findIndex(inter => inter._id === interventionId);
        if (existingIntervention !== -1) {
            pet.interventions[existingIntervention].interventionName = interventionName;
            pet.interventions[existingIntervention].date = interventionDate;
            pet.interventions[existingIntervention].vetName = vetName;
            pet.interventions[existingIntervention].clinicName = clinicName;
        } else {
            pet.interventions.push({
                interventionName,
                date: interventionDate,
                vetName,
                clinicName
            });
        }
        await pet.save();

        res.status(201).json({ message: 'Pet intervention created successfully', pet });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createOrUpdateAward = async (req, res) => {
    try {
        const {
            awardId,
            awardName,
            showName,
            date
        } = req.body;
        const pet = await Pet.findOne({ _id: req.params.id, owner: req.userId });

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found.' });
        }
        const awardDate = date ? new Date(date) : new Date();
        const existingAward = pet.awards.findIndex(award => award._id === awardId);
        if (existingAward !== -1) {
            pet.awards[existingAward].awardName = awardName;
            pet.awards[existingAward].date = awardDate;
            pet.awards[existingAward].showName = showName;
        } else {
            pet.awards.push({
                awardName,
                date: awardDate,
                showName
            });
        }
        await pet.save();

        res.status(201).json({ message: 'Pet award created successfully', pet });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
