import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { CreateError } from '../utils/error.js';
import { CreateSuccess } from '../utils/success.js';
import jwt from 'jsonwebtoken';
import { createEmail } from '../middlewares/merchantEmail.js';
import { sendVerificationEmail } from '../middlewares/forgetPassword.js';
import Randomstring from 'randomstring';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';


//TODO: register error handling perlu diperbaikin, biar bisa di acc front end.

// export const checkEmail = async (req, res, next) => {
//     console.log("checkEmail Kepanggil");
//     try {
//         const email = req.body.email;
//         console.log("email: ", email);
//         const doesEmailExist = await User.findOne({ email: req.body.email});
//         console.log("does email exist: ", doesEmailExist);
//         if(doesEmailExist != null){
//             console.log("email taken:", emailTaken);
        
//             return next(CreateSuccess(200, "Email Taken", emailTaken = true));
//         }
//         else{
//             return next(CreateError(500, "Internal Server Error"));
//         }
//     } catch (error) {
//         return next(CreateError(500, "Internal Server Error" ,error));
//     }
// };


export const checkEmail = async (req, res, next) => {
    console.log('checkEmail Kepanggil');
    try {
      const email = req.body.email;
      console.log('email: ', email);
      const doesEmailExist = await User.findOne({ email: req.body.email });
      console.log('does email exist: ', doesEmailExist);
      
      if (doesEmailExist) {
        return next(CreateSuccess(200, 'Email Taken'));
      } else {
        return next(CreateSuccess(200, 'Email Available'));
      }
    } catch (error) {
      return next(CreateError(500, 'Internal Server Error', error));
    }
  };



export const register2 = async (req, res, next) => {
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
                
                const temporaryPassword = Randomstring.generate(8);
                console.log("merch pw: ", temporaryPassword);
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: temporaryPassword,
                    roles: "merchant",
                    phoneNo: req.body.phoneNo,
                    description: req.body.description,
                    accountStatus: "pending",
                    //TODO:add file handling afterwards
                });
                await newUser.save();
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

export const register = async (req, res, next) => {
    try {
        console.log("masuk register");
        // Check if the email exists
        const doesEmailExist = await User.findOne({ email: req.body.email });
        console.log("does email exist: ", doesEmailExist);
        if (doesEmailExist) {
            return next(CreateError(400, "Email already exists"));
        } else {
            console.log("req info: ", req.body);
            console.log("masuk else");

            const salt = await bcrypt.genSalt(10);
            let hashedPassword = "";

            if (req.body.password != null) {
                hashedPassword = await new Promise((resolve, reject) => {
                    bcrypt.hash(req.body.password, salt, function (err, hash) {
                        if (err) reject(err);
                        resolve(hash);
                    });
                });
            }

            const roleType = req.body.roles;
            console.log("role type: ", roleType);

            if (roleType === 'merchant') {
                const form = new formidable.IncomingForm();

                form.parse(req, async (err, fields, files) => {
                    if (err) {
                        return next(CreateError(500, 'File upload failed', err));
                    }

                    const { name, email, phoneNo, description } = fields;

                    const { license, reviews, profilePic } = files;

                    // Define upload directory
                    const uploadDir = path.join(__dirname, 'uploads');
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir);
                    }

                    const validatePDF = (file) => {
                        const fileExtension = path.extname(file.name).toLowerCase();
                        return fileExtension === '.pdf';
                    };

                    // Validate file types
                    if (!validatePDF(license) || !validatePDF(reviews)) {
                        return next(CreateError(400, 'License and Reviews must be PDF files'));
                    }

                    const licensePath = path.join(uploadDir, 'merchant_license.pdf');
                    const reviewsPath = path.join(uploadDir, 'reviews.pdf');
                    const profilePicPath = path.join(uploadDir, 'profile_picture.jpg');

                    fs.renameSync(license.path, licensePath);
                    fs.renameSync(reviews.path, reviewsPath);
                    fs.renameSync(profilePic.path, profilePicPath);

                    try {
                        const newUser = new User({
                            name,
                            email,
                            password: hashedPassword,
                            roles: 'merchant',
                            phoneNo,
                            description,
                            licensePath,
                            reviewsPath,
                            profilePicPath,
                            accountStatus: 'pending',
                        });
                        await newUser.save();
                        return next(CreateSuccess(200, 'Merchant registered successfully!'));
                    } catch (error) {
                        console.log('Error creating merchant:', error);
                        return next(CreateError(500, 'Error creating merchant', error));
                    }
                });
            } else if (roleType === 'admin') {
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
            } else if (roleType === 'user') {
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
            } else {
                return next(CreateError(400, 'Invalid Role!'));
            }
        }
    } catch (error) {
        return next(CreateError(500, 'Internal Server Error', error));
    }
};





export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return next(CreateError(400, "Email is not found"));
        }
        if(user.accountStatus == 'pending' || user.accountStatus == 'rejected'){
            return next(CreateError(401, "Account is not approved yet"));
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            return next(CreateError(402, "Invalid password"));
        }

        

        let tokenExpiration = "5h";
        if(req.body.rememberMe){
            tokenExpiration = "30d";
            console.log("remember me checked");
        };

        const token = jwt.sign({ id: user._id, roles: user.roles, name: user.name, email: user.email }, process.env.TOKEN_SECRET, {
            expiresIn: tokenExpiration,
        });


        res.cookie("access_token", token, { httpOnly: true }).status(200).json({
            message: "Logged in successfully!",
            token: token,
            status:200,
            // data: {
            //     _id: user._id,
            //     email: user.email,
            //     name: user.name,
            //     roles: user.roles,
            // },
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


export const getMerchants = async (req, res, next) => {
    try {
        const merchants = await User.find(
            { roles: 'merchant' },
            '-password' // Excluding the password field
        ).select('name email phoneNo description accountStatus');
        console.log("merchants: ", merchants);

        res.status(200).json({ merchants });
    } catch (error) {
        return next(CreateError(500, 'Internal Server Error', error));
    }
};


export const acceptMerchant = async (req, res, next) => {
    console.log("masuk acc merchant");
    try {
        console.log("masuk trycatch");
        const merchantId = req.query.id;
        console.log("merchant id: ", merchantId);

        const merchant = await User.findById(merchantId);
        console.log("masuk randomstring");
        const merchantNewTempPassword = Randomstring.generate(8);
        console.log("new temp pw: ", merchantNewTempPassword);
        //hash the password using bcrypt salt 10
        const salt = await bcrypt.genSalt(10);
        const merchantHashedPw = await bcrypt.hash(merchantNewTempPassword, salt);
        console.log("hashed pw: ", merchantHashedPw);
        

        if (!merchant) {
            return next(CreateError(404, 'Merchant not found'));
        }
        merchant.password = merchantHashedPw;
        merchant.accountStatus = 'approved';
        await merchant.save();
            try {
                await createEmail(merchant, merchantNewTempPassword);
            } catch (error) {
                return next(CreateError(500, "Error Sending Email", error));
            }


        return next(CreateSuccess(200, 'Merchant Accepted Successfully'));

    } catch (error) {
        return next(CreateError(500, 'Internal Server Error', error));
    }
};

export const rejectMerchant = async (req, res, next) => {
    try {
        const merchantId = req.query.id;

        const merchant = await User.findById(merchantId);

        if (!merchant) {
            return next(CreateError(404, 'Merchant not found'));
        }

        merchant.accountStatus = 'rejected';
        await merchant.save();

        return next(CreateSuccess(200, 'Merchant rejected Successfully'));

    } catch (error) {
        return next(CreateError(500, 'Internal Server Error', error));
    }
}