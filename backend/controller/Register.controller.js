const { Register } = require("../model")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');

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
        console.log("Request body:", req.body);

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
            role: req.body.role || 'user',
            profileImage: req.file ? req.file.filename : ''
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Error while creating user",
            });
        }

        const { assesToken, refreshToken } = await generateTokens(user._id);

        const data = await Register.findOne({ email: req.body.email }).select("-password");

        return res.status(200)
            .cookie("assesToken", assesToken, { httpOnly: true, secure: true })
            .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
            .json({
                accessToken: assesToken,
                success: true,
                data: data,
                message: "User created successfully",
            });
    } catch (error) {
        console.error("Registration error:", error);
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
            .json({ success: true, finduser: finduser, data: userDetails, accessToken: assesToken, message: "Login successful" }); // Added accessToken to the response body

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

const getUserById = async (req, res) => {
    try {
        const user = await Register.findById(req.params.id).select('-password -refreshToken');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Handle password update
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        // Handle file upload
        if (req.file) {
            // Delete old profile image if exists
            const oldUser = await Register.findById(id);
            if (oldUser.profileImage) {
                const oldImagePath = path.join(__dirname, '..', 'uploads', oldUser.profileImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            // Set new profile image
            updateData.profileImage = req.file.filename;
        }

        const updatedUser = await Register.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password -refreshToken');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedUser,
            message: "User updated successfully"
        });
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update user",
            error: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await Register.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
};

const createUser = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            username,
            email,
            phone,
            birthdate,
            gender,
            address,
            city,
            state,
            country,
            role,
            password
        } = req.body;

        // Check if user already exists
        const existingUser = await Register.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new Register({
            firstName,
            lastName,
            username,
            email,
            phone,
            birthdate,
            gender,
            address,
            city,
            state,
            country,
            role: role || 'user',
            password: hashedPassword,
            profileImage: req.file ? req.file.filename : '',
            isactive: true
        });

        await user.save();

        // Get user details without sensitive data
        const userDetails = await Register.findOne({ email }).select("-password -refreshToken");

        // Try to generate tokens, but don't fail if it doesn't work
        let tokens = null;
        try {
            if (process.env.ACCESS_TOKEN_KEY && process.env.REFRESH_TOKEN_KEY) {
                tokens = await generateTokens(user._id);
            }
        } catch (tokenError) {
            console.error("Token generation error:", tokenError);
        }

        const response = {
            success: true,
            data: userDetails,
            message: "User created successfully"
        };

        // Only add tokens to response and cookies if they were generated successfully
        if (tokens) {
            response.accessToken = tokens.assesToken;
            return res.status(201)
                .cookie("assesToken", tokens.assesToken, { httpOnly: true, secure: true })
                .cookie("refreshToken", tokens.refreshToken, { httpOnly: true, secure: true })
                .json(response);
        }

        // If token generation failed, still return success but without tokens
        return res.status(201).json(response);

    } catch (error) {
        console.error("Create user error:", error);
        res.status(500).json({
            success: false,
            message: 'Error creating user',
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
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    createUser
}; 