//TODO: check AUTH mw ini semua


import jwt from 'jsonwebtoken';
import { CreateError } from '../utils/error.js';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return next(CreateError(401, 'Access denied, No Token!'));
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

        req.user = decoded; // Assign the decoded user to the request object for further use

        // You can fetch additional user information from the database if needed
        // For example, fetch the user details based on the ID stored in the token
        const user = await User.findById(decoded.id);

        if (!user) {
            return next(CreateError(404, 'User not found'));
        }

        // Optionally, you can attach the user object to the request
        req.currentUser = user;

        // If everything is fine, proceed to the next middleware or route handler
        next();

    } catch (error) {
        return next(CreateError(403, 'Invalid or expired token'));
    }
};
