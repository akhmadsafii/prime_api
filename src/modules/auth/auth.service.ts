import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AutoUserRepository } from "./auto-user.repository";
import { LoginDto } from "./auth.dto";
import { AuthenticatedUser, LdapProfile } from "./auth.types";
import { LdapAuthService } from "./ldap-auth.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly ldap: LdapAuthService,
    private readonly users: AutoUserRepository,
    private readonly jwt: JwtService,
  ) {}

  async login(credentials: LoginDto) {
    const userid = credentials.userid.trim().toLowerCase();
    const [ldapProfile, databaseUser] = await Promise.all([
      this.ldap.authenticate(userid, credentials.password),
      this.users.findByUserId(userid),
    ]);
    const user: AuthenticatedUser = {
      id: userid,
      userid,
      name:
        databaseUser?.username ||
        this.firstAttribute(ldapProfile.displayName) ||
        this.firstAttribute(ldapProfile.sn) ||
        userid,
      email:
        databaseUser?.email ||
        this.firstAttribute(ldapProfile.mail) ||
        `${userid}@dsnwp.net`,
      avatar: databaseUser?.url_img || null,
      plant: databaseUser?.def_plant || null,
    };

    const authToken = await this.jwt.signAsync({
      sub: user.id,
      userid: user.userid,
      name: user.name,
      email: user.email,
      plant: user.plant,
    });

    return {
      authToken,
      tokenType: "bearer",
      expiresIn: 24 * 60 * 60,
      user,
    };
  }

  private firstAttribute(value: LdapProfile[keyof LdapProfile]): string | null {
    if (typeof value === "string") return value;
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
    return null;
  }
}
