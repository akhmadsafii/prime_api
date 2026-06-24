import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../database/database.service';
import { LoginDto } from './auth.dto';
export declare class AuthService {
    private readonly config;
    private readonly database;
    private readonly jwt;
    constructor(config: ConfigService, database: DatabaseService, jwt: JwtService);
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
    private authenticateLdap;
    private escapeLdapFilter;
    private firstAttribute;
}
