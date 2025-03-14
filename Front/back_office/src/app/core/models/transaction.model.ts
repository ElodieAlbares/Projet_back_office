// transaction.model.ts
export interface Transaction {
    id: number;
    name: string;
    price: number;
    quantity: number;
    balance: number;
    timeStamp: string;
}