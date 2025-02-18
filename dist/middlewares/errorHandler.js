"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    // Log for errors
    console.error(err);
    // Define status of error, else : 500
    const status = err.status || 500;
    const message = err.message || "Something went wrong: Internal Server Error";
    res.status(status).json({ error: message });
}
