const jwt = require("jsonwebtoken");
const Users = require("../model/Register.model");


const auth = (roles = []) => (req, res, next) => {
    console.log("aaa", roles);

    try {
        const token = req.cookies.assesToken || req.header('authorization');
        console.log("Tokens", token);

        if (!token) {
            return res.status(401)
                .json({
                    success: false,
                    message: "Token not available"
                })
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_KEY, async function (err, decoded) {
            if (err) {
                return res.status(400)
                    .json({
                        success: false,
                        message: "Token invalid"
                    })
            }

            console.log("decoded", decoded);

            if (!roles.some((role) => role === decoded.role)) {
                return res.status(400)
                    .json({
                        success: false,
                        message: "You have not access"
                    })
            }

            const USERS = await Users.findOne({ _id: decoded._id });
            console.log("USERSss", USERS)

            if (!USERS) {
                return res.status(404)
                    .json({
                        success: false,
                        message: "User not found..!!"
                    })
            }
            req.user = USERS;

            next();

        }); 

    } catch (error) {
        return res.status(400)
        .json({
            success: false,
            message: error.message
        })
    }
}

module.exports = auth;