// src/types/models/User.ts
export interface User {
    id: string;
    name: string;
    email: string;
    password: string; // Hashed
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}