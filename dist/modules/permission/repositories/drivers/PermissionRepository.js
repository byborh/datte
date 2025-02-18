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
exports.PermissionRepository = void 0;
const Permission_1 = require("@modules/permission/domain/Permission");
class PermissionRepository {
    constructor() {
        this.permissions = [
            new Permission_1.Permission('perm1', 'CREATE', 'user', 'Permet de créer un nouvel utilisateur'),
            new Permission_1.Permission('perm2', 'READ', 'message', 'Permit de lire les messages existants'),
            new Permission_1.Permission('perm3', 'UPDATE', 'video', 'Autorise la mise à jour des … publiques')
        ];
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
exports.PermissionRepository = PermissionRepository;
