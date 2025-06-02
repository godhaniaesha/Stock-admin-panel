const {Register} = require("../model")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const generateTokens = async (id) => {
    console.log("id", id);
    try {
        const user = await Register.findOne({ _id: id });
        console.log("user", user);
        if (!user) {
            throw new Error("User not found");
        }

        const assesToken = jwt.sign(
            {
                _id: user._id,
                username: user.username,
                role: user.role
            },
            process.env.ACCESS_TOKEN_KEY,
            { expiresIn: 60 * 60 });

        const refreshToken = await jwt.sign(
            {
                _id: user._id
            },
            process.env.REFRESH_TOKEN_KEY,
            { expiresIn: 60 * 60 * 24 * 2 }
        );

        console.log("assesToken", assesToken);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return {
            assesToken,
            refreshToken
        }

    } catch (error) {
        throw new Error(error.message);
    }
}

const RegisterUser = async (req, res) => {
    try {
        console.log("Request body:", req.body); // Debug log

        const finduser = await Register.findOne({ email: req.body.email });
        console.log("finduser", finduser);

        if (finduser) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Email already exists",
            });
        }

        const bcryptpass = await bcrypt.hash(req.body.password, 10);

        const user = await Register.create({
            ...req.body,
            password: bcryptpass,
            role: req.body.role || 'user' // Set default role if not provided
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Error while creating user",
            });
        }

        // Generate tokens after successful registration
        const { assesToken, refreshToken } = await generateTokens(user._id);

        const data = await Register.findOne({ email: req.body.email }).select("-password");

        return res.status(200)
            .cookie("assesToken", assesToken, { httpOnly: true, secure: true })
            .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
            .json({
                success: true,
                data: data,
                message: "User created successfully",
            });
    } catch (error) {
        console.error("Registration error:", error); // Debug log
        res.status(500).json({
            success: false,
            data: [],
            error: error.message,
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const finduser = await Register.findOne({ email });
        if (!finduser) {
            return res.status(400).json({ success: false, message: "Invalid email, please try again" });
        }

        const isPasswordValid = await bcrypt.compare(password, finduser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid password, please try again" });
        }

        const { assesToken, refreshToken } = await generateTokens(finduser._id);
        const userDetails = await Register.findOne({ email }).select("-password -refreshToken");
        console.log("userDetails", userDetails);

        return res.status(200)
            .cookie("accessToken", assesToken, { httpOnly: true, secure: true })
            .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
            .json({ success: true,finduser:finduser, data: userDetails, accessToken: assesToken, message: "Login successful" }); // Added accessToken to the response body

    } catch (error) {
        return res.status(500).json({ success: false, message: "Login failed: " + error.message });
    }
};

const generateNewToken = async (req, res) => {
    const token = req.cookies.refreshToken || req.header('authorization')?.replace("Bearer ", "");
    console.log("TOKENS", token);

    if (!token) {
        return res.status(401)
            .json({
                success: false,
                message: "Token not available"
            })
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_KEY, async function (err, decoded) {
        try {
            if (err) {
                return res.status(400)
                    .json({
                        success: false,
                        message: "Token invalid"
                    })
            }

            const USERS = await Register.findOne({ _id: decoded._id });
            console.log("USERSss", USERS)

            if (!USERS) {
                return res.status(404)
                    .json({
                        success: false,
                        message: "User not found..!!"
                    })
            }

            if (token !== USERS.refreshToken) {
                return res.status(400)
                    .json({
                        success: false,
                        message: "Invalid user"
                    })
            }

            const { assesToken, refreshToken } = await generateTokens(decoded._id);

            const userDetails = await Register.findOne({ email: USERS.email }).select("-password -refreshToken");
            console.log("userDetailsss", userDetails);

            const option = {
                httpOnly: true,
                secure: true
            }

            return res.status(200)
                .cookie("assesToken", assesToken, option)
                .cookie("refreshToken", refreshToken, option)
                .json({
                    success: true,
                    data: userDetails,
                    error: "Login success!!"
                });

        } catch (error) {
            return res.status(500).json({
                success: false,
                data: [],
                error: "Error in register user: " + error.message
            })
        }
    });
}

const logoutUser = async (req, res) => {
    try {
        const user = await Register.findByIdAndUpdate(
            req.body._id,
            {
                $unset: {
                    refreshToken: 1
                }
            },
            {
                new: true
            }
        );

        return res.status(200)
            .clearCookie("assesToken")
            .clearCookie("refreshToken")
            .json({
                success: true,
                data: user,
                message: 'user logout successfully'
            })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "user logout not complete" + error.message
        })
    }
}

const authnticateCheck = async (req, res) => {
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

            const USERS = await Register.findOne({ _id: decoded._id });
            console.log("USERSss", USERS)

            if (!USERS) {
                return res.status(404)
                    .json({
                        success: false,
                        message: "User not found..!!"
                    })
            }

            return res.status(200)
                .json({
                    success: true,
                    data: USERS,
                    error: "Auth successfully!!"
                });

        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Login not complete" + error.message
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await Register.find({}).select("-password -refreshToken");
        
        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                data: [],
                message: "No users found"
            });
        }

        return res.status(200).json({
            success: true,
            data: users,
            message: "Users retrieved successfully"
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({
            success: false,
            data: [],
            error: error.message
        });
    }
};

module.exports = {
    RegisterUser,
    login,
    logoutUser,
    generateNewToken,
    authnticateCheck,
    generateTokens,
    getAllUsers
}; 