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
const jwt_1 = require("@nestjs/jwt");
const auto_user_repository_1 = require("./auto-user.repository");
const ldap_auth_service_1 = require("./ldap-auth.service");
let AuthService = class AuthService {
    ldap;
    users;
    jwt;
    constructor(ldap, users, jwt) {
        this.ldap = ldap;
        this.users = users;
        this.jwt = jwt;
    }
    async login(credentials) {
        const userid = credentials.userid.trim().toLowerCase();
        const [ldapProfile, databaseUser] = await Promise.all([
            this.ldap.authenticate(userid, credentials.password),
            this.users.findByUserId(userid),
        ]);
        const user = {
            id: userid,
            userid,
            name: databaseUser?.username ||
                this.firstAttribute(ldapProfile.displayName) ||
                this.firstAttribute(ldapProfile.sn) ||
                userid,
            email: databaseUser?.email ||
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
    firstAttribute(value) {
        if (typeof value === "string")
            return value;
        if (Array.isArray(value) && typeof value[0] === "string")
            return value[0];
        return null;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ldap_auth_service_1.LdapAuthService,
        auto_user_repository_1.AutoUserRepository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map