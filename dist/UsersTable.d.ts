import type { User } from '@/lib/api/users';
interface UsersTableProps {
    users: User[];
    totalUsers: number;
    currentPage: number;
    limit: number;
}
export default function UsersTable({ users, totalUsers, currentPage, limit }: UsersTableProps): any;
export {};
