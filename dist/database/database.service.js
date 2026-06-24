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
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const promise_1 = require("mysql2/promise");
let DatabaseService = class DatabaseService {
    pools;
    constructor(config) {
        this.pools = {
            prime: this.createPool(config, 'DB_'),
            auto: this.createPool(config, 'DB_AUTO_'),
        };
    }
    async query(database, sql, values = []) {
        const [rows] = await this.pools[database].execute(sql, values);
        return rows;
    }
    async ping() {
        const status = await Promise.allSettled([
            this.query('prime', 'SELECT 1 AS connected'),
            this.query('auto', 'SELECT 1 AS connected'),
        ]);
        return { prime: status[0].status === 'fulfilled', auto: status[1].status === 'fulfilled' };
    }
    async onModuleDestroy() {
        await Promise.all(Object.values(this.pools).map((pool) => pool.end()));
    }
    createPool(config, prefix) {
        const fallbackPrefix = prefix === 'DB_AUTO_' ? 'DB_' : prefix;
        const value = (key) => config.get(`${prefix}${key}`) ?? config.getOrThrow(`${fallbackPrefix}${key}`);
        return (0, promise_1.createPool)({
            host: value('HOST'),
            port: Number(config.get(`${prefix}PORT`) ?? config.get(`${fallbackPrefix}PORT`) ?? 3306),
            user: value('USERNAME'),
            password: value('PASSWORD'),
            database: value('DATABASE'),
            waitForConnections: true,
            connectionLimit: 10,
            namedPlaceholders: true,
            timezone: 'Z',
        });
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DatabaseService);
//# sourceMappingURL=database.service.js.map