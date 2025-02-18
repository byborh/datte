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
exports.PermissionController = void 0;
class PermissionController {
    constructor(permissionService) {
        this.permissionService = permissionService;
    }
    getPermissionById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (e) {
                console.error("Internal server error. Cannot get permission by id", e);
                throw new Error("Internal server error");
            }
        });
    }
    getAllPermissions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (e) {
                console.error("Internal server error. Cannot get permissions", e);
                throw new Error("Internal server error");
            }
        });
    }
    createPermission(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (e) {
                console.error("Internal server error. Cannot create permission", e);
                throw new Error("Internal server error");
            }
        });
    }
    modifyPermission(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (e) {
                console.error("Internal server error. Cannot modify permission", e);
                throw new Error("Internal server error");
            }
        });
    }
    deletePermission(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (e) {
                console.error("Internal server error. Cannot delete permission", e);
                throw new Error("Internal server error");
            }
        });
    }
}
exports.PermissionController = PermissionController;
