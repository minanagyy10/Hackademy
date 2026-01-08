import jwt from 'jsonwebtoken';
import { systemRoles } from '../../../src/constants/constants.js';
import { Admin } from '../db/models/admin.model.js';

export const auth = (roles = []) => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers;
            if (!authorization?.startsWith('Bearer')) {
                return res.status(400).json({ message: "In-valid Bearer key" });
            }
            const token = authorization.split(' ')[1];
            if (!token) {
                return res.status(400).json({ message: "In-valid token" });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET_LOGIN);
            if (!decoded?.id) {
                return res.status(400).json({ message: "In-valid token payload" });
            }

            const user = await Admin.findById(decoded.id); // Assuming only Admins use this panel
            if (!user) {
                return res.status(404).json({ message: "Not register account" });
            }

            if (!roles.includes(user.role)) {
                return res.status(403).json({ message: "Forbidden account" });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(500).json({ message: "Catch error", error: error.message });
        }
    };
};
