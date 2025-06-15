export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    category: 'PC' | 'Console' | 'Mobile';
    imageUrl: string;
    rating?: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}