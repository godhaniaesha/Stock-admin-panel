const jwt = require("jsonwebtoken");
const Users = require("../model/Register.model");

const auth = (roles = []) => (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No authorization header"
            });
        }

        // Extract token from "Bearer <token>"
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.substring(7) 
            : authHeader;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not available"
            });
        }

        // If token is from header, remove "Bearer " prefix
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_KEY, async function (err, decoded) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: "Token invalid"
                });
            }
            console.log("decoded", decoded);

            if (!roles.some((role) => role === decoded.role)) {
                return res.status(400).json({
                    success: false,
                    message: "You have not access"
                });
            }

            const USERS = await Users.findOne({ _id: decoded._id });
            if (!USERS) {
                return res.status(404).json({
                    success: false,
                    message: "User not found..!!"
                });
            }
            req.user = USERS;
            next();
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = auth;