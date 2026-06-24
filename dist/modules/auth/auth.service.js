"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const ldapts_1 = require("ldapts");
const database_service_1 = require("../../database/database.service");
let AuthService = class AuthService {
    config;
    database;
    jwt;
    constructor(config, database, jwt) {
        this.config = config;
        this.database = database;
        this.jwt = jwt;
    }
    async login(credentials) {
        const userid = credentials.userid.trim().toLowerCase();
        const ldapUser = await this.authenticateLdap(userid, credentials.password);
        const rows = await this.database.query('auto', `SELECT userid, username, email, url_img, def_plant
       FROM syuser
       WHERE userid = ?
         AND deleted_at IS NULL
       LIMIT 1`, [userid]);
        const databaseUser = rows[0];
        const user = {
            id: userid,
            userid,
            name: databaseUser?.username ||
                this.firstAttribute(ldapUser.displayName) ||
                this.firstAttribute(ldapUser.sn) ||
                userid,
            email: databaseUser?.email ||
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
    async authenticateLdap(userid, password) {
        const host = this.config.getOrThrow('LDAP_HOST');
        const port = this.config.get('LDAP_PORT') ?? '389';
        const useSsl = this.config.get('LDAP_SSL') === 'true';
        const protocol = useSsl ? 'ldaps' : 'ldap';
        const domain = this.config.get('LDAP_USER_DOMAIN') ?? 'dsnwp.net';
        const baseDn = this.config.getOrThrow('LDAP_BASE_DN');
        const client = new ldapts_1.Client({
            url: `${protocol}://${host}:${port}`,
            timeout: Number(this.config.get('LDAP_TIMEOUT') ?? 5000) * 1000,
            connectTimeout: Number(this.config.get('LDAP_TIMEOUT') ?? 5000) * 1000,
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
        }
        catch {
            throw new common_1.UnauthorizedException('NIK/User ID atau password salah.');
        }
        finally {
            await client.unbind().catch(() => undefined);
        }
    }
    escapeLdapFilter(value) {
        return value.replace(/[\0()*\\]/g, (character) => {
            const code = character.charCodeAt(0).toString(16).padStart(2, '0');
            return `\\${code}`;
        });
    }
    firstAttribute(value) {
        if (typeof value === 'string')
            return value;
        if (Array.isArray(value) && typeof value[0] === 'string')
            return value[0];
        return null;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        database_service_1.DatabaseService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map