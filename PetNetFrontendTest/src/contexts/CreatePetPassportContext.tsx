import { createContext, useContext, useState } from "react";

type PetPassportData = {
    name?: string;
    species?: string,
    breed?: string,
    gender?: string,
    dateOfBirth?: Date,
    chip?: string,
    imageUrl?: string
};

type PetPassportContextType = {
    data: PetPassportData,
    updateData: (newData: Partial<PetPassportData>) => void;
    resetData: () => void;
}

const PetPassportContext = createContext<PetPassportContextType | undefined>(undefined);

export const PetPassportProvider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = useState<PetPassportData>({});

    const updateData = (newData: Partial<PetPassportData>) => {
        setData((prev) => ({ ...prev, ...newData }));
    };

    const resetData = () => setData({});

    return (
        <PetPassportContext.Provider value={{ data, updateData, resetData }}>
            {children}
        </PetPassportContext.Provider>
    );
};

export const usePetPassport = () => {
    const context = useContext(PetPassportContext);
    if (!context) throw new Error('usePetPassport must be used within PetPassportProvider');
    return context;
};