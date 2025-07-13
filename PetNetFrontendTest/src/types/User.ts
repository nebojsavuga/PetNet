export interface Address {
    addressString: string;
    latitude: number;
    longitude: number;
}

export interface User {
    _id: string;
    fullName: string;
    email?: string;
    phoneNumber?: string;
    verificationType: 'email' | 'phone';
    address: Address;
    walletAddress: string;
    createdAt: string;
    updatedAt: string;
}
