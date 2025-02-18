import { Request, Response, NextFunction } from 'express'; 

export const lengthRequirementMiddleware = (minLength: number, attributeName: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        let attributeValue: string = req.body[attributeName];

        if(attributeValue.length < minLength) {
            res.status(400).json({error: `The ${attributeName} must be at least ${minLength} characters long.`});
            return;
        }

        next();
    }
}