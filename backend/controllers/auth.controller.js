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
        console.log("masuk register");
        //cari user udah ada apa belom
        const doesEmailExist = await User.findOne({ email: req.body.email});
        console.log("does email exist: ", doesEmailExist);
        if (doesEmailExist) {
        return next(CreateError(400, "Email already exists"));
        }
        else{
            console.log("req info: ", req.body);
            console.log("masuk else");
            const salt = await bcrypt.genSalt(10);
            console.log("salt: ", salt);
            let hashedPassword = "";
            if(req.body.password != null){
                hashedPassword = await new Promise((resolve, reject) => {
                    bcrypt.hash(req.body.password, salt, function(err, hash) {
                      if (err) reject(err)
                      resolve(hash)
                    });
                  })
                // hashedPassword = await bcrypt.hash(req.body.password, salt);
    
                console.log("hashedpw: ", hashedPassword);
                console.log("req info: ", req.body);
            };
            // const hashedPassword = await bcrypt.hash(req.body.password, salt);
            console.log("JS KONTOL: ", hashedPassword);
           
            const roleType = req.body.roles;
            console.log("role type: ", roleType); 
            if(roleType == 'admin'){
                console.log("seorang admin");
                try {
                    console.log("masuk trycatch");
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: hashedPassword,
                        roles: req.body.roles,
                        phoneNo: req.body.phoneNo,
                    });
                    await newUser.save();
                    return next(CreateSuccess(200, "Admin registered successfully!"));
                } catch (error) {
                    console.log("error di create email", error);
                }
                console.log("new user: ", newUser);
            }
            else if(roleType == 'user'){
                try {
                    console.log("seorang user");
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
                } catch (error) {
                    console.log("error di create email", error);
                }
            }
            else if(roleType == 'merchant'){
                console.log("masuk merchant");
                const merchSalt = await bcrypt.genSalt(10);
                const merchPassword = Randomstring.generate(8);
                // const merchHashedPassword = await bcrypt.hash(merchPassword, merchSalt);
                const merchHashedPassword = await new Promise((resolve, reject) => {
                    bcrypt.hash(merchPassword, merchSalt, function(err, hash) {
                      if (err) reject(err)
                      resolve(hash)
                    });
                  })
                console.log("merch pw: ", merchPassword);
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
                    req.body.password = merchPassword;
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

//TODO: paling bener nge send user ID berdasarkan token di front-end
//perlu userId, currentPassword, newPassword dari front-end
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

//TODO: ubah komennya
//perlu email aja dari front end
export const forgetPassword = async (req, res, next) => {
    console.log("method forget pass");
    try {
        console.log("masuk trycatch");
        const email = req.body.email;
        console.log("email: ", email);
        // Check if the user exists with the given email
        const user = await User.findOne({ email });
        if (!user) {
            return next(CreateError(404, 'User not found'));
        }
        console.log("user found: ", user);
        // Generate a random verification code (You need to implement this function)
        const verificationCode = Randomstring.generate(9); 

        // Save the verification code to the user's data in the database
        user.resetPasswordCode = verificationCode; 
        await user.save();
        console.log("vercode: ", verificationCode);

        // Send the verification email to the user 
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

//perlu verification code sama email dari front-end
// export const validateVerificationCode = async (req, res, next) => {
//     try {
//         const email = req.body.email;
//         const verificationCode = req.body.verificationCode;
//         console.log("email: ", email);
//         console.log("vercode: ", verificationCode);

//         // Check if the user exists with the given email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return next(CreateError(404, 'User not found'));
//         }
//         console.log("user found: ", user);
//         console.log("front end vercode: ", verificationCode);
//         console.log("back end vercode: ", user.resetPasswordCode);
//         // Check if the verification code is correct
//         if (user.resetPasswordCode !== verificationCode) {
//             return next(CreateError(400, 'Invalid verification code'));
//         }

//         return next(CreateSuccess(200, 'Verification Code Validated Successfully'));

//     } catch (error) {
//         return next(CreateError(500, 'Validate Verification Code Error', error));
//     }
// };

//perlu verification code, newPassword, sama email dari front-end.
//dia nyari user berdasarkan email, terus dia ngecek vercode sama vercode di db.
//abis itu, psw baru di hash, di save ke db dan reset vercode jadi null.
export const validateVerificationCode = async (req, res, next) => {
    try {
        const email = req.body.email;
        const verificationCode = req.body.verificationCode;
        const newPassword = req.body.newPassword;

        // Check if the user exists with the given email
        const user = await User.findOne({ email });
        if (!user) {
            return next(CreateError(404, 'User not found'));
        }

        // Check if the verification code is correct
        if (user.resetPasswordCode !== verificationCode) {
            return next(CreateError(400, 'Invalid verification code'));
        }

        // Change the user's password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedNewPassword;
        user.resetPasswordCode = null;
        await user.save();

        return next(CreateSuccess(200, 'New Password Saved Successfully'));

    } catch (error) {
        return next(CreateError(500, 'New Password Error', error));
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