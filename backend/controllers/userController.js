import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Username already exists, please try a different one" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate profile photo URL based on gender
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        await User.create({
            fullName,
            username,
            password: hashedPassword,
            profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
            gender
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.error("❌ Error during registration:", error);
        return res.status(500).json({ message: "Internal server error during registration" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Both username and password are required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Incorrect username or password" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect username or password" });
        }

        if (!process.env.JWT_SECRET_KEY) {
            return res.status(500).json({ message: "JWT_SECRET_KEY is not defined" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        console.log("Generated JWT token:", token);  // Debugging line

        return res.status(200)
            .cookie("token", token, { maxAge: 86400000, httpOnly: true, sameSite: 'strict' })
            .json({
                success: true,
                user: {
                    _id: user._id,
                    username: user.username,
                    fullName: user.fullName,
                    profilePhoto: user.profilePhoto
                }
            });

    } catch (error) {
        console.error("❌ Error during login:", error);
        return res.status(500).json({ message: "Internal server error during login" });
    }
};


export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully."
        });
    } catch (error) {
        console.error("❌ Error during logout:", error);
        return res.status(500).json({ message: "Internal server error during logout" });
    }
};

export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json(otherUsers);
    } catch (error) {
        console.error("❌ Error fetching other users:", error);
        return res.status(500).json({ message: "Internal server error while fetching users" });
    }
};
