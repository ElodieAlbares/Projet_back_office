// product.model.ts
export interface Product {
    id: number;
    category: number;
    price: number;
    unit: string;
    availability: boolean;
    sale: boolean;
    discount: number;
    stock: number;
}