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
const mongoose = require('mongoose');
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
        const { id } = req.params;

        const pet = await Pet.findById(id)
            .populate('parents')
            .populate('children');

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        return res.status(200).json({
            parents: pet.parents,
            children: pet.children,
        });
    } catch (error) {
        console.error('Failed to fetch pet family:', error);
        return res.status(500).json({ error: 'Internal server error' });
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
                date: iterventionDate,
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
            _id,
            place,
            awardName,
            showName,
            date
        } = req.body;
        const pet = await Pet.findOne({ _id: req.params.id, owner: req.userId });

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found.' });
        }
        const awardDate = date ? new Date(date) : new Date();
        const existingAward = pet.awards.findIndex(award => award._id.equals(new mongoose.Types.ObjectId(_id)));
        if (existingAward !== -1) {
            pet.awards[existingAward].awardName = awardName;
            pet.awards[existingAward].date = awardDate;
            pet.awards[existingAward].showName = showName;
            pet.awards[existingAward].place = place;
        } else {
            pet.awards.push({
                awardName,
                date: awardDate,
                showName,
                place
            });
        }
        await pet.save();

        res.status(201).json({ message: 'Pet award created successfully', pet });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.addTemporaryParent = async (req, res) => {
    const { id } = req.params;
    const { name, breed, gender, dateOfBirth } = req.body;

    try {
        const childPet = await Pet.findById(id);

        if (!childPet) {
            return res.status(404).json({ error: 'Child pet not found!' });
        }

        if (childPet.parents.length > 2) {
            return res.status(400).json({ error: 'This pet already has 2 parents' });
        }

        const tempParent = new Pet({
            name,
            breed,
            race: 'Unknown',
            gender,
            dateOfBirth,
            owner: '000000000000000000000000'
        });

        await tempParent.save();

        childPet.parents.push(tempParent._id);
        await childPet.save();

        return res.status(201).json({
            message: 'Temporary parent created and assigned successfully',
            parent: tempParent,
            updatedPet: childPet
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

exports.deleteParent = async (req, res) => {
    try {
        const { petId, parentId } = req.params;

        const child = await Pet.findById(petId);
        if (!child) return res.status(404).json({ error: 'Pet not found' });

        child.parents = child.parents.filter((pId) => pId.toString() !== parentId);
        await child.save();

        const parent = await Pet.findById(parentId);
        if (!parent) return res.status(404).json({ error: 'Parent not found' });

        parent.children = parent.children.filter(
            (cId) => cId.toString() !== petId
        );
        await parent.save();

        // Check if this parent is still used by any other pet
        const stillReferenced = await Pet.exists({
            _id: { $ne: petId },
            parents: parent._id
        });

        if (!stillReferenced && parent.owner?.toString() === '000000000000000000000000') {
            await Pet.findByIdAndDelete(parentId);
            return res.status(200).json({ message: 'Parent unlinked and deleted successfully', updatedPet: child });
        }

        return res.status(200).json({ message: 'Parent unlinked successfully', updatedPet: child });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

exports.addExistingParent = async (req, res) => {
    try {
        const { id, parentId } = req.params;

        const childPet = await Pet.findById(id);

        if (!childPet) return res.status(404).json({ error: 'Pet not found' })

        const parentPet = await Pet.findById(parentId);

        if (!parentPet) return res.status(404).json({ error: 'Parent not found' });

        childPet.parents.push(parentPet._id);
        await childPet.save();

        parentPet.children.push(childPet._id);
        await parentPet.save();


        return res.status(201).json({
            message: 'Parent assigned successfully',
            parent: parentPet,
            updatedPet: childPet
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

exports.addExistingChild = async (req, res) => {
    try {
        const { id, childId } = req.params;

        const parentPet = await Pet.findById(id);
        if (!parentPet) return res.status(404).json({ error: 'Parent not found' });

        const childPet = await Pet.findById(childId);
        if (!childPet) return res.status(404).json({ error: 'Child not found' });

        if (childPet.parents.length >= 2)
            return res.status(400).json({ error: 'Child pet already has two parents' });

        if (childPet.children.includes(parentPet._id))
            return res.status(400).json({ error: 'Child pet is parent of the selected parent' });

        if (!childPet.parents.includes(parentPet._id)) {
            childPet.parents.push(parentPet._id);
            await childPet.save();
        }

        if (!parentPet.children.includes(childPet._id)) {
            parentPet.children.push(childPet._id);
            await parentPet.save();
        }

        return res.status(201).json({
            message: 'Child assigned successfully',
            updatedParent: parentPet,
            updatedPet: childPet
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteChild = async (req, res) => {
    try {
        const { petId, childId } = req.params;

        const parent = await Pet.findById(petId);
        if (!parent) return res.status(404).json({ error: 'Pet not found' });

        parent.children = parent.children.filter((pId) => pId.toString() !== childId);
        await parent.save();

        const child = await Pet.findById(childId);
        if (!child) return res.status(404).json({ error: 'Child not found' });

        child.parents = parent.parents.filter(
            (cId) => cId.toString() !== petId
        );
        await child.save();

        const stillReferenced = await Pet.exists({
            _id: { $ne: petId },
            children: child._id
        });

        if (!stillReferenced && child.owner?.toString() === '000000000000000000000000') {
            await Pet.findByIdAndDelete(childId);
            return res.status(200).json({ message: 'Child unlinked and deleted successfully', updatedPet: parent });
        }

        return res.status(200).json({ message: 'Child unlinked successfully', updatedPet: parent });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

exports.addOrUpdateVaccination = async (req, res) => {
    try {
        const { petId } = req.params;
        const { vaccineId, timestamp } = req.body;

        const pet = await Pet.findById(petId).populate('vaccinations.vaccine');
        if (!pet) return res.status(404).json({ error: 'Pet not found' });

        // Check if this vaccine already exists (revaccination)
        const existing = pet.vaccinations.find(
            (v) => v.vaccine.toString() === vaccineId
        );

        if (existing) {
            existing.timestamp = timestamp;
        } else {
            pet.vaccinations.push({
                vaccine: vaccineId,
                timestamp,
                completed: true,
            });
        }

        await pet.save();

        const updated = await Pet.findById(petId)
            .populate('vaccinations.vaccine')
            .lean();

        return res.status(200).json({ message: 'Vaccination recorded', pet: updated });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
};