export interface IUser {
    id?: number;
    username: string;
    email: string;
    password: string;
    role: 'super_admin' | 'user' | 'product_admin';
}