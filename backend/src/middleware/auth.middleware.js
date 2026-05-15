import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production";

export const authenticateToken = (req, res, next) => {
    // Get token from header, query, or body
    const token = req.headers.authorization?.split(' ')[1] || 
                  req.query.token || 
                  req.body.token;

    if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).json({ 
            message: "Access token required" 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(httpStatus.UNAUTHORIZED).json({ 
                message: "Token expired. Please login again." 
            });
        }
        return res.status(httpStatus.FORBIDDEN).json({ 
            message: "Invalid token" 
        });
    }
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};
