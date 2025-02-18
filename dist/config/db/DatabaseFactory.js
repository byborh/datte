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
exports.DatabaseFactory = void 0;
const AppDataSource_1 = require("./drivers/AppDataSource");
const RedisDatabase_1 = require("./drivers/RedisDatabase");
class DatabaseFactory {
    static createDatabase(type, config) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (type) {
                case "mysql":
                    if (!AppDataSource_1.AppDataSource.isInitialized) {
                        yield AppDataSource_1.AppDataSource.initialize();
                    }
                    return AppDataSource_1.AppDataSource;
                case "redis":
                    return new RedisDatabase_1.RedisDatabase(config);
                default:
                    throw new Error("Invalid database type");
            }
        });
    }
}
exports.DatabaseFactory = DatabaseFactory;
