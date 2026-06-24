import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Client } from 'ldapts';
import { RowDataPacket } from 'mysql2/promise';
import { DatabaseService } from '../../database/database.service';
import { LoginDto } from './auth.dto';

interface AutoUserRow extends RowDataPacket {
  userid: string;
  username: string | null;
  email: string | null;
  url_img: string | null;
  def_plant: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly database: DatabaseService,
    private readonly jwt: JwtService,
  ) {}

  async login(credentials: LoginDto) {
    const userid = credentials.userid.trim().toLowerCase();
    const ldapUser = await this.authenticateLdap(userid, credentials.password);

    const rows = await this.database.query<AutoUserRow>(
      'auto',
      `SELECT userid, username, email, url_img, def_plant
       FROM syuser
       WHERE userid = ?
         AND deleted_at IS NULL
       LIMIT 1`,
      [userid],
    );

    const databaseUser = rows[0];
    const user = {
      id: userid,
      userid,
      name:
        databaseUser?.username ||
        this.firstAttribute(ldapUser.displayName) ||
        this.firstAttribute(ldapUser.sn) ||
        userid,
      email:
        databaseUser?.email ||
        this.firstAttribute(ldapUser.mail) ||
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
      tokenType: 'bearer',
      expiresIn: 24 * 60 * 60,
      user,
    };
  }

  private async authenticateLdap(userid: string, password: string) {
    const host = this.config.getOrThrow<string>('LDAP_HOST');
    const port = this.config.get<string>('LDAP_PORT') ?? '389';
    const useSsl = this.config.get<string>('LDAP_SSL') === 'true';
    const protocol = useSsl ? 'ldaps' : 'ldap';
    const domain = this.config.get<string>('LDAP_USER_DOMAIN') ?? 'dsnwp.net';
    const baseDn = this.config.getOrThrow<string>('LDAP_BASE_DN');
    const client = new Client({
      url: `${protocol}://${host}:${port}`,
      timeout: Number(this.config.get<string>('LDAP_TIMEOUT') ?? 5000) * 1000,
      connectTimeout:
        Number(this.config.get<string>('LDAP_TIMEOUT') ?? 5000) * 1000,
    });

    try {
      await client.bind(`${userid}@${domain}`, password);
      const { searchEntries } = await client.search(baseDn, {
        scope: 'sub',
        filter: `(sAMAccountName=${this.escapeLdapFilter(userid)})`,
        attributes: ['sAMAccountName', 'displayName', 'sn', 'mail'],
        sizeLimit: 1,
      });

      return searchEntries[0] ?? {};
    } catch {
      throw new UnauthorizedException('NIK/User ID atau password salah.');
    } finally {
      await client.unbind().catch(() => undefined);
    }
  }

  private escapeLdapFilter(value: string) {
    return value.replace(/[\0()*\\]/g, (character) => {
      const code = character.charCodeAt(0).toString(16).padStart(2, '0');
      return `\\${code}`;
    });
  }

  private firstAttribute(value: unknown): string | null {
    if (typeof value === 'string') return value;
    if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
    return null;
  }
}
