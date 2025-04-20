import { RoleContract } from "../contracts/IRole";
import { TRoleName } from "../contracts/TRoleName";

export abstract class RoleAbstract implements RoleContract {
    id: string;
    name: TRoleName;
    description: string;

    constructor(id: string, name: TRoleName, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    getId(): string { return this.id; }
    getName(): string { return this.name; }
    getDescription(): string { return this.description; }

    setId(id: string): void { this.id = id; }
    setName(name: TRoleName): void { this.name = name; }
    setDescription(description: string): void { this.description = description; }
}