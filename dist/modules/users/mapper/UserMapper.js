"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const User_1 = require("../domain/User");
class UserMapper {
    // Transfirm the dto to the entity
    static toEntity(dto) {
        return new User_1.User({
            id: dto.id,
            email: dto.email,
            password: '', // Void
            salt: '', // Void
            firstname: dto.firstname || null,
            lastname: dto.lastname || null,
            pseudo: dto.pseudo || null,
            telnumber: dto.telnumber || null,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt
        });
    }
    // Transform the entity to the dto
    static toDTO(user) {
        return {
            id: user.getId(),
            email: user.getEmail(),
            firstname: user.getFirstname(),
            lastname: user.getLastname(),
            pseudo: user.getPseudo(),
            telnumber: user.getTelnumber(),
            createdAt: user.getCreatedAt(),
            updatedAt: user.getUpdatedAt()
        };
    }
}
exports.UserMapper = UserMapper;
