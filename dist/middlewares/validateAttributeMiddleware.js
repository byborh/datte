"use strict";
/**
 * Middleware to validate the presence of a specific attribute (e.g., an ID) in a given location of the request (params, body, or query).
 * This middleware is modular and can validate any attribute in the request's location (params, body, or query) provided as arguments.
 *
 * Usage:
 *   - Pass the location (params, body, or query), the attribute name to validate (e.g., 'id'), and a customizable error message.
 *   - If the attribute is missing in the specified location, a 400 Bad Request response is sent with the error message.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAttributeMiddleware = void 0;
const validateAttributeMiddleware = (locationName, attributeName, errorMessage) => {
    return (req, res, next) => {
        // Check if location is valid
        if (!['params', 'body', 'query'].includes(locationName)) {
            res.status(400).json({ error: "Invalid location, It must be 'params', 'body' or 'query'" });
            return;
        }
        let attributeValue;
        // Validate attribute based on the provided location
        switch (locationName) {
            case 'params':
                attributeValue = req.params[attributeName];
                break;
            case 'body':
                attributeValue = req.body[attributeName];
                break;
            case 'query':
                attributeValue = req.query[attributeName];
                break;
        }
        // If attribute is missing, return an error response
        if (!attributeValue) {
            res.status(400).json({ error: errorMessage });
            return;
        }
        // Proceed to the next middleware or controller
        next();
    };
};
exports.validateAttributeMiddleware = validateAttributeMiddleware;
// Example of usage:
// import { validateAttributeMiddleware } from './path/to/middleware';
// router.get('/user/:id', validateAttributeMiddleware('params', 'id', 'Invalid user ID'), userController.getUserById);
