import { User } from '../entities/user.entity';
export declare class CreateUserDto {
    name: string;
    email: string;
    role: User['role'];
}
