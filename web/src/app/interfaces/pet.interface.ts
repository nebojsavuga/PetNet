import { Award } from "./award.interface";
import { Intervention } from "./intervention.interface";
import { Vaccine } from "./vaccine.interface";

export interface Vaccination {
    vaccine: string;
    timestamp: number;
    completed: boolean;
    _id: string
}

export interface Pet {
    awards: Award[];
    breed: string,
    children: string[];
    createdAt: string;
    dateOfBirth: string;
    gender: string;
    imageUrl: string;
    intreventionReports: Intervention[];
    name: string;
    nftMintAddress: string;
    nftUri: string;
    owner: string;
    parents: string[];
    race: string;
    updatedAt: string;
    vaccinations: Vaccination[];
    chipNumber: string;
    _id: string;
}