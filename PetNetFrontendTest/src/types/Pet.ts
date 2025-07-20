export interface Award {
    _id: string;
    awardName: string;
    showName: string;
    date: string;
}

export interface Intervention {
    _id: string;
    interventionName: string;
    clinicName: string;
    vetName: string;
    date: string;
}

export interface Vaccination {
    _id: string;
    name: string;
    timestamp: string;
    nextDue?: string;
    completed: boolean;
}

export interface Pet {
    _id: string;
    name: string;
    gender: 'Male' | 'Female' | 'Castrated Male' | 'Sterilized Female' | 'Unknown';
    chipNumber?: string;
    race: string;
    breed: string;
    dateOfBirth: string;
    imageUrl?: string;
    owner: string; // User._id
    fatherId?: string;
    motherId?: string;
    children: string[];
    awards: Award[];
    interventions: Intervention[];
    vaccinations: Vaccination[];
    createdAt: string;
    updatedAt: string;
}
