"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = void 0;
class Permission {
    constructor(id, action, resource, description) {
        this.id = id;
        this.action = action;
        this.resource = resource;
        this.description = description;
    }
    getId() { return this.id; }
    getAction() { return this.action; }
    getResource() { return this.resource; }
    getDescription() { return this.description; }
    setId(id) { this.id = id; }
    setAction(action) { this.action = action; }
    setResource(resource) { this.resource = resource; }
    setDescription(description) { this.description = description; }
}
exports.Permission = Permission;
