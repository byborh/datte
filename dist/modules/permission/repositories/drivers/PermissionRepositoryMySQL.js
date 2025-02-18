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
exports.PermissionRepositoryMySQL = void 0;
class PermissionRepositoryMySQL {
    constructor(db) {
        // Injection of database
        this.db = db;
    }
    getPermissionByField(field, value) {
        return __awaiter(this, void 0, void 0, function* () { return null; });
    }
    getPermissionById(permissionId) {
        return __awaiter(this, void 0, void 0, function* () { return null; });
    }
    getPermissions() {
        return __awaiter(this, void 0, void 0, function* () { return null; });
    }
    createPermission(permission) {
        return __awaiter(this, void 0, void 0, function* () { return null; });
    }
    modifyPermission(permission) {
        return __awaiter(this, void 0, void 0, function* () { return null; });
    }
    deletePermission(permissionId) {
        return __awaiter(this, void 0, void 0, function* () { return true; });
    }
}
exports.PermissionRepositoryMySQL = PermissionRepositoryMySQL;
