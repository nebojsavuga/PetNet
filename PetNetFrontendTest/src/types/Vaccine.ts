export interface Vaccine {
    _id: string;
    name: string;
    revaccinationPeriod: number; // in days
    isMandatory: boolean;
}