// src/types/models/Order.ts
export interface Order {
    id: string;
    userId: string;
    products: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}