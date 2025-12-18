export declare enum CustomerType {
    INDIVIDUAL = "individual",
    CORPORATE = "corporate"
}
export declare class Customer {
    id: number;
    type: CustomerType;
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
    city: string;
    district: string;
    address: string;
    taxOffice: string;
    taxNumber: string;
    tcIdentityNumber: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}
