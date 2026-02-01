export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
}