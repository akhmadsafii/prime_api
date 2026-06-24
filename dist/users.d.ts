export interface User {
    id: number;
    name: string;
    email: string;
    role: 'Admin' | 'Developer' | 'Analyst';
    status: 'active' | 'pending' | 'banned';
    lastLogin: string;
    avatarUrl?: string;
}
export interface PaginatedUsersResponse {
    data: User[];
    total: number;
}
export declare function getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
}): Promise<PaginatedUsersResponse>;
export declare function createUser(userData: {
    name: string;
    email: string;
    role: User['role'];
}): Promise<User>;
export declare function getUserById(id: string): Promise<User>;
export declare function updateUser(id: string, userData: Partial<{
    name: string;
    email: string;
    role: User['role'];
}>): Promise<User>;
export declare function deleteUser(id: string): Promise<void>;
