"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisDatabase = void 0;
const redis_1 = require("redis");
// Redis Database Config
class RedisDatabase {
    constructor(config) {
        this.config = config;
        this.client = (0, redis_1.createClient)({
            url: `redis://${config.password ? `:${config.password}@` : ''}${config.host}:${config.port}`
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.connect();
            console.log("Connected to Redis database");
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.disconnect();
            console.log("Disconnected from Redis database");
        });
    }
    query(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.client.get(key);
            return JSON.parse(value || 'null');
        });
    }
}
exports.RedisDatabase = RedisDatabase;
