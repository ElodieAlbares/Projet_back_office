// product.model.ts
export interface Product {
    id: number;
    name: string;
    category: number;
    price: number;
    unit: string;
    availability: boolean;
    sale: boolean;
    discount: number;
    quantity: number;
}