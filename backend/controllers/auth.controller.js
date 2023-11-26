import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { CreateError } from '../utils/error.js';
import { CreateSuccess } from '../utils/success.js';
import jwt from 'jsonwebtoken';
import { createEmail } from '../middlewares/merchantEmail.js';
import { sendVerificationEmail } from '../middlewares/forgetPassword.js';
import Randomstring from 'randomstring';

//TODO: register error handling perlu diperbaikin, biar bisa di acc front end.
export const register = async (req, res, next) => {
    try {
        //cari user udah ada apa belom
        const doesEmailExist = await User.findOne({ email: req.body.email});
        if (doesEmailExist) {
        return next(CreateError(400, "Email already exists"));
        }
        else{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const roleType = req.body.roles;
            if(roleType == 'admin'){
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword,
                    roles: "admin",
                    phoneNo: req.body.phoneNo,
                });
                await newUser.save();
                return next(CreateSuccess(200, "Admin registered successfully!"));
            }
            else if(roleType == 'user'){
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword,
                    roles: "user",
                    phoneNo: req.body.phoneNo,
                    address: req.body.address,
                });
                await newUser.save();
                return next(CreateSuccess(200, "User registered successfully!"));
            }
            else if(roleType == 'merchant'){
                const merchSalt = await bcrypt.genSalt(10);
                const merchPassword = Randomstring.generate(8);
                const merchHashedPassword = await bcrypt.hash(merchPassword, merchSalt);
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: merchHashedPassword,
                    roles: "merchant",
                    phoneNo: req.body.phoneNo,
                    description: req.body.description,
                    //TODO:add file handling afterwards
                });
                await newUser.save();
                console.log("############### CReate Email ###############");
                try {
                    await createEmail(req.body);
                } catch (error) {
                    console.log("error di create email");
                    console.log(error);
                    return next(CreateError(500, error));
                }
                return next(CreateSuccess(200, "Merchant registered successfully!"));
            }
            else{
                return next(CreateError(400, "Invalid Role!"));
            }
        }
    } catch (error) {
        return next(CreateError(500, "Internal Server Error" ,error));
    }
};


export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return next(CreateError(400, "Email is not found"));
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            return next(CreateError(400, "Invalid password"));
        }

        let tokenExpiration = "5h";
        if(req.body.rememberMe){
            tokenExpiration = "30d";
            console.log("remember me checked");
        };

        const token = jwt.sign({ id: user._id, roles: user.roles }, process.env.TOKEN_SECRET, {
            expiresIn: tokenExpiration,
        });


        res.cookie("access_token", token, { httpOnly: true }).status(200).json({
            message: "Logged in successfully!",
            token: token,
            roles: user.roles,
            data: {
                _id: user._id,
                email: user.email,
                name: user.name,
            },
        });

    } catch (error) {
        return next(CreateError(500, "Internal Server Error" ,error));
    }
};

//TODO: gabisa di test pake postman, kalo mau test pake front end
export const changePassword = async (req, res, next) => {
    try {
        // const userId = req.user.id;
        const userId = req.body.userId;

        const user = await User.findById(userId);

        if (!user) {
            return next(CreateError(404, 'User Not Found'));
        }

        const validPassword = await bcrypt.compare(req.body.currentPassword, user.password);

        if (!validPassword) {
            return next(CreateError(400, 'Invalid Current Password'));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(req.body.newPassword, salt);

        user.password = hashedNewPassword;
        await user.save();

        return next(CreateSuccess(200, 'Password Changed Successfully'));

    } catch (error) {
        return next(CreateError(500, "Internal Server Error" ,error));
    }
};

export const forgetPassword = async (req, res, next) => {
    try {
        const email = req.body.email;

        // Check if the user exists with the given email
        const user = await User.findOne({ email });
        if (!user) {
            return next(CreateError(404, 'User not found'));
        }

        // Generate a random verification code (You need to implement this function)
        const verificationCode = Randomstring.generate(9); 

        // Save the verification code to the user's data in the database
        user.resetPasswordCode = verificationCode; // Assuming you have a field in your User model to store the verification code
        console.log("vercode: ", verificationCode);

        // Send the verification email to the user (You need to implement this function)
        try {
            await sendVerificationEmail(user, verificationCode);
        } catch (error) {
            console.log("error di create email");
            console.log(error);
            return next(CreateError(500, error));
        }
        return next(CreateSuccess(200, "Verification Code Sent Successfully!"));


    } catch (error) {
        return next(CreateError(500, 'Forget Password Error', error));
    }
};

export const logout = async (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json({
            message: 'Logged out successfully!',
        });
    } catch (error) {
        return next(CreateError(500, error));
    }
};