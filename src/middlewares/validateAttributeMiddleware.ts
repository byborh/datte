/**
 * Middleware to validate the presence of a specific attribute (e.g., an ID) in a given location of the request (params, body, or query).
 * This middleware is modular and can validate any attribute in the request's location (params, body, or query) provided as arguments.
 *
 * Usage:
 *   - Pass the location (params, body, or query), the attribute name to validate (e.g., 'id'), and a customizable error message.
 *   - If the attribute is missing in the specified location, a 400 Bad Request response is sent with the error message.
 */

import { Request, Response, NextFunction } from 'express';

export const validateAttributeMiddleware = (
    locationName: 'params' | 'body' | 'query',
    attributeName: string,
    errorMessage: string,
    checkToken: boolean = false // Verify the token or not
) => {
    return (req: Request, res: Response, next: NextFunction): void => {

        // Verify the token
        if (checkToken) {
            const token = req.headers['authorization'];
            if (!token) {
                res.status(401).json({ error: "Unauthorized: No token provided" });
                return;
            }
        }

        // Check if location is valid
        if (!['params', 'body', 'query'].includes(locationName)) {
            res.status(400).json({ error: "Invalid location, It must be 'params', 'body' or 'query'" });
            return;
        }

        let attributeValue: any;

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

// Example of usage:
// import { validateAttributeMiddleware } from './path/to/middleware';
// router.get('/user/:id', validateAttributeMiddleware('params', 'id', 'Invalid user ID'), userController.getUserById);