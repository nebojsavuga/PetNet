import { createContext, useContext, useState } from "react";

type OnboardingData = {
    fullname?: string;
    email?: string,
    phoneNumber?: string,
    addressString?: string,
    walletAddress?: string,
    latitude?: number,
    longitude?: number,
    verificationType?: 'email' | 'phone'
};

type OnboardingContextType = {
    data: OnboardingData,
    updateData: (newData: Partial<OnboardingData>) => void;
    resetData: () => void;
}  

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = useState<OnboardingData>({});

    const updateData = (newData: Partial<OnboardingData>) => {
        setData((prev) => ({ ...prev, ...newData }));
    };

    const resetData = () => setData({});

    return (
        <OnboardingContext.Provider value={{ data, updateData, resetData }}>
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) throw new Error('useOnboarding must be used within OnboardingProvider');
    return context;
};