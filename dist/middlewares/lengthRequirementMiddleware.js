"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lengthRequirementMiddleware = void 0;
const lengthRequirementMiddleware = (minLength, attributeName) => {
    return (req, res, next) => {
        let attributeValue = req.body[attributeName];
        if (attributeValue.length < minLength) {
            res.status(400).json({ error: `The ${attributeName} must be at least ${minLength} characters long.` });
            return;
        }
        next();
    };
};
exports.lengthRequirementMiddleware = lengthRequirementMiddleware;
