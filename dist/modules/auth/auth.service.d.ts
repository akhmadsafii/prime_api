import { JwtService } from "@nestjs/jwt";
import { AutoUserRepository } from "./auto-user.repository";
import { LoginDto } from "./auth.dto";
import { AuthenticatedUser } from "./auth.types";
import { LdapAuthService } from "./ldap-auth.service";
export declare class AuthService {
    private readonly ldap;
    private readonly users;
    private readonly jwt;
    constructor(ldap: LdapAuthService, users: AutoUserRepository, jwt: JwtService);
    login(credentials: LoginDto): Promise<{
        authToken: string;
        tokenType: string;
        expiresIn: number;
        user: AuthenticatedUser;
    }>;
    private firstAttribute;
}
