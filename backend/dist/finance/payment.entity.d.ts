export declare enum PaymentType {
    INCOME = "income",
    EXPENSE = "expense"
}
export declare enum PaymentMethod {
    CASH = "cash",
    CREDIT_CARD = "credit_card",
    BANK_TRANSFER = "bank_transfer",
    CHECK = "check"
}
export declare class Payment {
    id: number;
    type: PaymentType;
    partyType: string;
    partyId: number;
    partyName: string;
    amount: number;
    method: PaymentMethod;
    description: string;
    date: Date;
}
