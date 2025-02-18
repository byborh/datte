import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    // Log for errors
    console.error(err);

    // Define status of error, else : 500
    const status = err.status || 500;
    const message = err.message || "Something went wrong: Internal Server Error";

    res.status(status).json({ error: message });
}