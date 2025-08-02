import { Vaccine } from "./Vaccine";

export interface Award {
    _id: string | null;
    place: '1st' | '2nd' | '3rd' | 'Participated';
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
    vaccineId: string; // still useful
    timestamp: string;
    completed: boolean;
    vaccine: Vaccine; // full vaccine data
    nextDue?: string;    // Optional: calculated in frontend/backend
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
    owner: string;
    parents: string[];
    children: string[];
    awards: Award[];
    interventions: Intervention[];
    vaccinations: Vaccination[];
    createdAt: string;
    updatedAt: string;
}
