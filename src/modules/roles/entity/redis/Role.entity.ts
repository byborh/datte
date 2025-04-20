import { RoleContract } from "@modules/roles/contracts/IRole";
import { TRoleName } from "../../contracts/TRoleName";
import { RoleAbstract } from "../Role.abstract";

export class RoleRedisEntity extends RoleAbstract {
    id: string;
    name: TRoleName;
    description: string | null;

    data: Record<string, any> | null;

    constructor(data: Partial<RoleContract>) {
        super(data.id, data.name, data.description);
        // Object.assign(this, data);
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
    }

    // Convert object to Redis hash
    toRedisHash(): { [key: string]: string } {
        return {
            id: this.id,
            name: this.name as string,
            description: this.description || "",
        }
    }

    // Convert Redis hash to object
    static fromRedisHash(hash: { [key: string]: string }): RoleRedisEntity {
        return new RoleRedisEntity({
            id: hash.id,
            name: hash.name as TRoleName,
            description: hash.description
        })
    }

    public getId(): string { return this.id; }
    public getName(): string { return this.name; }
    public getDescription(): string { return this.description; }

    public setId(id: string): void { this.id = id; }
    public setName(name: TRoleName): void { this.name = name; }
    public setDescription(description: string | null): void { this.description = description; }
}