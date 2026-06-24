import { LoginDto } from './auth.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    login(credentials: LoginDto): Promise<{
        authToken: string;
        tokenType: string;
        expiresIn: number;
        user: {
            id: string;
            userid: string;
            name: string;
            email: string;
            avatar: string | null;
            plant: string | null;
        };
    }>;
}
