import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";
import jwt from "jsonwebtoken";
import { createEmail } from "../middlewares/merchantEmail.js";
import { sendVerificationEmail } from "../middlewares/forgetPassword.js";
import Randomstring from "randomstring";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

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



export const register = async (req, res, next) => {
  const form = new IncomingForm();
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const uploadDir = path.join(__dirname, "merchant_uploads");

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return next(CreateError(500, "File upload failed", err));
    }

    try {
      const doesEmailExist = await User.findOne({ email: fields.email });
      if (doesEmailExist) {
        return next(CreateError(400, "Email already exists"));
      }
      const getFieldValue = (fieldValue) =>
        Array.isArray(fieldValue) ? fieldValue[0] : fieldValue;

      let hashedPassword = null;
      const salt = await bcrypt.genSalt(10);
      if (getFieldValue(fields.password) != null) {
        hashedPassword = await bcrypt.hash(
          getFieldValue(fields.password),
          salt
        );
        console.log("user ada passw");
      } else {
        hashedPassword = await bcrypt.hash(Randomstring.generate(9), salt);
        console.log("user ga ada passw: ", hashedPassword);
      }
      console.log("HASHED PW: ", hashedPassword);
      console.log("FIELDS: ", fields);

      const roleType = getFieldValue(fields.roles);
      let newUser;

      if (roleType == "merchant") {
        //TODO check this
        console.log("masuk merhcant bro");
        console.log("Files:", files);
        // Define upload directory for merchants
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const { name, email, phoneNo, description } = fields;

        // const { license, reviews } = files;

        const validatePDF = (filesArray) => {
          if (
            !filesArray ||
            !filesArray.length ||
            !filesArray[0].originalFilename
          ) {
            return false;
          }
          const fileExtension = path
            .extname(filesArray[0].originalFilename)
            .toLowerCase();
          return fileExtension === ".pdf";
        };

        // In the part of the code where you validate and process the uploaded files
        if (!validatePDF(files.license) || !validatePDF(files.reviews)) {
          return next(
            CreateError(400, "License and Reviews must be PDF files")
          );
        }

                //v3
                const moveAndRenameFile = (source, originalName, targetDir) => {
                    // Extract the file extension from the original file name
                    const fileExtension = path.extname(originalName);
                    // Generate a new file name using the original name with a unique prefix
                    const uniquePrefix = uuidv4(); // Or any other method to generate a unique string
                    const newFileName = uniquePrefix + fileExtension; // Keep the .pdf extension
                    // Create the full path for the new file
                    const targetPath = path.join(targetDir, newFileName);
                
                    fs.copyFileSync(source, targetPath); // Copy the file to the new location
                    fs.unlinkSync(source); // Delete the original file
                
                    return newFileName; // Return the new file name for storing in the database
                };
                try {
                    const licenseNewFileName = moveAndRenameFile(
                        files.license[0].filepath,
                        files.license[0].originalFilename, // This should have the .pdf extension
                        uploadDir
                    );
                    const reviewsNewFileName = moveAndRenameFile(
                        files.reviews[0].filepath,
                        files.reviews[0].originalFilename, // This should have the .pdf extension
                        uploadDir
                    );
                    const licensePath = path.join(uploadDir, licenseNewFileName);
                    const reviewsPath = path.join(uploadDir, reviewsNewFileName);
                    newUser = new User({
                        name: getFieldValue(name),
                        email: getFieldValue(email),
                        password: hashedPassword,
                        roles: 'merchant',
                        phoneNo: getFieldValue(phoneNo),
                        description: getFieldValue(description),
                        licensePath: licensePath,
                        reviewsPath: reviewsPath,
                        accountStatus: 'pending',
                        licenseDescription: getFieldValue(fields.licenseDescription),
                        reviewsDescription: getFieldValue(fields.reviewsDescription),
                    });
                } catch (error) {
                    console.log('Error moving files:', error);
                    return next(CreateError(500, 'Error moving files', error));
                }
                
                    
            } else if (roleType === 'admin' || roleType === 'user') {
                console.log("masuk reg user biasa");
                newUser = new User({
                    name: getFieldValue(fields.name),
                    email: getFieldValue(fields.email),
                    password: hashedPassword,
                    roles: roleType,
                    phoneNo: getFieldValue(fields.phoneNo),
                    address: getFieldValue(fields.address),
                    accountStatus: 'approved',
                    
                });
            } else {
                return next(CreateError(400, 'Invalid Role!'));
            }

      await newUser.save();
      return next(
        CreateSuccess(
          200,
          `${
            roleType.charAt(0).toUpperCase() + roleType.slice(1)
          } registered successfully!`
        )
      );
    } catch (error) {
      console.log("Error registering user:", error);
      return next(CreateError(500, "Error registering user", error));
    }
  });
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(CreateError(400, "Email is not found"));
    }
    if (user.accountStatus == "pending" || user.accountStatus == "rejected") {
      return next(CreateError(401, "Account is not approved yet"));
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return next(CreateError(402, "Invalid password"));
    }

    let tokenExpiration = "5h";
    if (req.body.rememberMe) {
      tokenExpiration = "30d";
      console.log("remember me checked");
    }

    const token = jwt.sign(
      { id: user._id, roles: user.roles, name: user.name, email: user.email, hasResetPassword: user.hasResetPassword },
      process.env.TOKEN_SECRET,
      {
        expiresIn: tokenExpiration,
      }
    );

    res.cookie("access_token", token, { httpOnly: true }).status(200).json({
      message: "Logged in successfully!",
      token: token,
      status: 200,
    });
  } catch (error) {
    return next(CreateError(500, "Internal Server Error", error));
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
      return next(CreateError(404, "User Not Found"));
    }

    const validPassword = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );

    if (!validPassword) {
      return next(CreateError(400, "Invalid Current Password"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(req.body.newPassword, salt);

        user.password = hashedNewPassword;
        await user.save();

    return next(CreateSuccess(200, "Password Changed Successfully"));
  } catch (error) {
    return next(CreateError(500, "Internal Server Error", error));
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
      return next(CreateError(404, "User not found"));
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
    return next(CreateError(500, "Forget Password Error", error));
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
      return next(CreateError(404, "User not found"));
    }

    // Check if the verification code is correct
    if (user.resetPasswordCode !== verificationCode) {
      return next(CreateError(400, "Invalid verification code"));
    }

    // Change the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedNewPassword;
    user.resetPasswordCode = null;
    await user.save();

    return next(CreateSuccess(200, "New Password Saved Successfully"));
  } catch (error) {
    return next(CreateError(500, "New Password Error", error));
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json({
      message: "Logged out successfully!",
    });
  } catch (error) {
    return next(CreateError(500, error));
  }
};

export const getMerchants = async (req, res, next) => {
  try {
    const merchants = await User.find(
      { roles: "merchant" },
      "-password" // Excluding the password field
    ).select("name email phoneNo description accountStatus");
    console.log("merchants: ", merchants);

    res.status(200).json({ merchants });
  } catch (error) {
    return next(CreateError(500, "Internal Server Error", error));
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
      return next(CreateError(404, "Merchant not found"));
    }
    merchant.password = merchantHashedPw;
    merchant.accountStatus = "approved";
    await merchant.save();
    try {
      await createEmail(merchant, merchantNewTempPassword);
    } catch (error) {
      return next(CreateError(500, "Error Sending Email", error));
    }

    return next(CreateSuccess(200, "Merchant Accepted Successfully"));
  } catch (error) {
    return next(CreateError(500, "Internal Server Error", error));
  }
};

export const rejectMerchant = async (req, res, next) => {
  try {
    const merchantId = req.query.id;

    const merchant = await User.findById(merchantId);

    if (!merchant) {
      return next(CreateError(404, "Merchant not found"));
    }

    merchant.accountStatus = "rejected";
    await merchant.save();

    return next(CreateSuccess(200, "Merchant rejected Successfully"));
  } catch (error) {
    return next(CreateError(500, "Internal Server Error", error));
  }
};
