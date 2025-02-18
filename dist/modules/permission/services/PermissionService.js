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
exports.PermissionService = void 0;
class PermissionService {
    constructor(permissionRepository) {
        this.permissionRepository = permissionRepository;
    }
    getPermissionById(permissionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.permissionRepository.getPermissionById(permissionId);
        });
    }
    getPermissions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.permissionRepository.getPermissions();
        });
    }
    createPermission(permission) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.permissionRepository.createPermission(permission);
        });
    }
    modifyPermission(permission) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.permissionRepository.modifyPermission(permission);
        });
    }
    deletePermission(permissionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.permissionRepository.deletePermission(permissionId);
        });
    }
}
exports.PermissionService = PermissionService;
