import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client } from "ldapts";
import { LdapProfile } from "./auth.types";

@Injectable()
export class LdapAuthService {
  constructor(private readonly config: ConfigService) {}

  async authenticate(userid: string, password: string): Promise<LdapProfile> {
    const client = new Client({
      url: this.connectionUrl,
      timeout: this.timeoutMs,
      connectTimeout: this.timeoutMs,
    });

    try {
      await client.bind(`${userid}@${this.userDomain}`, password);
      const { searchEntries } = await client.search(this.baseDn, {
        scope: "sub",
        filter: `(sAMAccountName=${this.escapeFilter(userid)})`,
        attributes: ["sAMAccountName", "displayName", "sn", "mail"],
        sizeLimit: 1,
      });

      return (searchEntries[0] as LdapProfile | undefined) ?? {};
    } catch {
      throw new UnauthorizedException("NIK/User ID atau password salah.");
    } finally {
      await client.unbind().catch(() => undefined);
    }
  }

  private get connectionUrl(): string {
    const protocol =
      this.config.get<string>("LDAP_SSL") === "true" ? "ldaps" : "ldap";
    const host = this.config.getOrThrow<string>("LDAP_HOST");
    const port = this.config.get<string>("LDAP_PORT") ?? "389";
    return `${protocol}://${host}:${port}`;
  }

  private get timeoutMs(): number {
    return Number(this.config.get<string>("LDAP_TIMEOUT") ?? 5) * 1000;
  }

  private get baseDn(): string {
    return this.config.getOrThrow<string>("LDAP_BASE_DN");
  }

  private get userDomain(): string {
    return this.config.get<string>("LDAP_USER_DOMAIN") ?? "dsnwp.net";
  }

  private escapeFilter(value: string): string {
    return value.replace(/[\0()*\\]/g, (character) => {
      const code = character.charCodeAt(0).toString(16).padStart(2, "0");
      return `\\${code}`;
    });
  }
}
