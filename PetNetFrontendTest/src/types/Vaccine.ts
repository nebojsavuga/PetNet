export interface Vaccine {
    _id: string;
    name: string;
    isMandatory: boolean;
    revaccinationPeriod: number; // In days
}