import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";
import jwt from "jsonwebtoken";
import { createEmail } from "../middlewares/merchantEmail.js";
import { sendVerificationEmail } from "../middlewares/forgetPassword.js";
import { rejectEmail } from "../middlewares/rejectMerchantEmail.js";
import Randomstring from "randomstring";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

//Checks availability of an email address, can be proactively called by the front-end--
//--to check if an email is available before registering a new user.
export const checkEmail = async (req, res, next) => {
  try {
    const email = req.body.email;
    const doesEmailExist = await User.findOne({ email: req.body.email });
    if (doesEmailExist) {
      return next(CreateSuccess(200, "Email Taken"));
    } else {
      return next(CreateSuccess(200, "Email Available"));
    }
  } catch (error) {
    return next(CreateError(500, "Internal Server Error", error));
  }
};

//Registers a user into the system according to their roles.
export const register = async (req, res, next) => {
  const form = new IncomingForm();
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const uploadDir = path.join(__dirname, "..", "merchant_uploads");

  //Since we're using formidable, we need to parse the request first.
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return next(CreateError(500, "File upload failed", err));
    }

    try {
      //Again, checks if the email entered is available.
      const doesEmailExist = await User.findOne({ email: fields.email });
      if (doesEmailExist) {
        return next(CreateError(400, "Email already exists"));
      }
      const getFieldValue = (fieldValue) =>
        Array.isArray(fieldValue) ? fieldValue[0] : fieldValue;
      //Hashes the password using bcrypt salt 10.
      let hashedPassword = null;
      const salt = await bcrypt.genSalt(10);
      if (getFieldValue(fields.password) != null) {
        hashedPassword = await bcrypt.hash(
          getFieldValue(fields.password),
          salt
        );
      } else {
        //If the registering user is a merchant, generate a random password.
        hashedPassword = await bcrypt.hash(Randomstring.generate(9), salt);
      }

      const roleType = getFieldValue(fields.roles);
      let newUser;

      //Register user if the user's role is a merchant.
      if (roleType == "merchant") {
        //Creates an upload folder if it does not already exists.
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const { name, email, phoneNo, description } = fields;

        //Checks if the uploaded files are PDFs.
        //then gets the file name.
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

        //Return error if PDF files are invalid.
        if (!validatePDF(files.license) || !validatePDF(files.reviews)) {
          return next(
            CreateError(400, "License and Reviews must be PDF files")
          );
        }

        //Geneartes a unique file name for the uploaded files.
        //Then moves it to the upload folder.
        const moveAndRenameFile = (source, originalName, targetDir) => {
          //This also keeps the original file extension.
          const fileExtension = path.extname(originalName);
          //This is when the unique file name is generated.
          const uniquePrefix = uuidv4();
          const newFileName = uniquePrefix + fileExtension;
          const targetPath = path.join(targetDir, newFileName);

          //This moves the file into the specified upload folder.
          fs.copyFileSync(source, targetPath);
          fs.unlinkSync(source);

          //Returns the new file name to be saved on the database.
          return newFileName;
        };
        try {
          //Calls the move and rename function for license and reviews files.
          const licenseNewFileName = moveAndRenameFile(
            files.license[0].filepath,
            files.license[0].originalFilename,
            uploadDir
          );
          const reviewsNewFileName = moveAndRenameFile(
            files.reviews[0].filepath,
            files.reviews[0].originalFilename,
            uploadDir
          );

          //Saves the user into the db.
          //The license and reviews path are the new file names, since they are unique.
          const licensePath = licenseNewFileName;
          const reviewsPath = reviewsNewFileName;
          newUser = new User({
            name: getFieldValue(name),
            email: getFieldValue(email),
            password: hashedPassword,
            roles: "merchant",
            phoneNo: getFieldValue(phoneNo),
            description: getFieldValue(description),
            licensePath: licensePath,
            reviewsPath: reviewsPath,
            accountStatus: "pending",
            licenseDescription: getFieldValue(fields.licenseDescription),
            reviewsDescription: getFieldValue(fields.reviewsDescription),
          });
        } catch (error) {
          return next(CreateError(500, "Error moving files", error));
        }
      }
      //Register user if the user's role is an admin or a user.
      else if (roleType === "officer" || roleType === "user") {
        newUser = new User({
          name: getFieldValue(fields.name),
          email: getFieldValue(fields.email),
          password: hashedPassword,
          roles: roleType,
          phoneNo: getFieldValue(fields.phoneNo),
          address: getFieldValue(fields.address),
          accountStatus: "approved",
        });
      } else {
        return next(CreateError(400, "Invalid Role!"));
      }

      //Saves the user into the db.
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
      return next(CreateError(500, "Error registering user", error));
    }
  });
};

//Log the user in and return a JWT token.
export const login = async (req, res, next) => {
  try {
    //Find the user's email in the db.
    const user = await User.findOne({ email: req.body.email });
    //If no user is found, return an error.
    if (!user) {
      return next(CreateError(400, "Email is not found"));
    }
    //If the user's account is pending or rejected, return an error.
    if (user.accountStatus == "pending" || user.accountStatus == "rejected") {
      return next(CreateError(401, "Account is not approved yet"));
    }
    //Compare the password provided with the one in the database.
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    //Returns an error if the password is invalid.
    if (!validPassword) {
      return next(CreateError(402, "Invalid password"));
    }

    //Set token to expire within 5hrs by default.
    let tokenExpiration = "5h";

    //Sign the JWT token with the appropriate user data.
    const token = jwt.sign(
      {
        id: user._id,
        roles: user.roles,
        name: user.name,
        email: user.email,
        hasResetPassword: user.hasResetPassword,
      },
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

//Change password for merchants.
//Used the first time a merchant logs in.
export const changePassword = async (req, res, next) => {
  try {
    //First, it finds the user according to the ID sent from the front-end.
    const userId = req.body.userId;
    const user = await User.findById(userId);

    if (!user) {
      return next(CreateError(404, "User Not Found"));
    }
    //Then it compares the merchant entered password with the one set to their email.
    const validPassword = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );
    if (!validPassword) {
      return next(CreateError(400, "Invalid Current Password"));
    }

    //This hashes the merchant's new password, then saves it to the database.
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(req.body.newPassword, salt);
    user.password = hashedNewPassword;
    user.hasResetPassword = true;
    await user.save();
    return next(CreateSuccess(200, "Password Changed Successfully"));
  } catch (error) {
    return next(CreateError(500, "Internal Server Error", error));
  }
};

//Forgot password function - part 1.
//User enters their email, then this function will send an email to the user's email.
//The email has a verification code that the user can use to reset their password.
export const forgetPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      return next(CreateError(404, "User not found"));
    }
    //Generate a random verification password.
    const verificationCode = Randomstring.generate(9);

    //Save the verification code to the user's data in the database
    user.resetPasswordCode = verificationCode;
    await user.save();

    //Send the verification email to the user
    try {
      await sendVerificationEmail(user, verificationCode);
    } catch (error) {
      return next(CreateError(500, "Error sending email", error));
    }
    return next(CreateSuccess(200, "Verification Code Sent Successfully!"));
  } catch (error) {
    return next(CreateError(500, "Forget Password Error", error));
  }
};

//Forgot password function - part 2.
//Validates the verification code sent to the user's email.
//This method needs to enter their email, verification code, and new password.
export const validateVerificationCode = async (req, res, next) => {
  try {
    const email = req.body.email;
    const verificationCode = req.body.verificationCode;
    const newPassword = req.body.newPassword;

    //Find if the user exists first.
    const user = await User.findOne({ email });
    if (!user) {
      return next(CreateError(404, "User not found"));
    }

    //Then, check if the verification code is correct.
    if (user.resetPasswordCode !== verificationCode) {
      return next(CreateError(400, "Invalid verification code"));
    }

    //Finally, change the user's password if the verification code is correct.
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

//TODO: HEN LOGOUT backend kalau diperluin (apus kalau di akhir gakepake).
// //Logout function.
// //Clears the cookie from the browser.
export const logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json({
      message: "Logged out successfully!",
    });
  } catch (error) {
    return next(CreateError(500, error));
  }
};

//Retreives all merchants from the database without any filter.
export const getMerchants = async (req, res, next) => {
  try {
    const merchants = await User.find(
      { roles: "merchant" },
      "-password" //Remove password from the response.
    ).select("name email phoneNo description accountStatus");

    //Unable to use custom success response here.
    //So we use regular res.status(200).json instead.
    res.status(200).json({ merchants });
  } catch (error) {
    return next(CreateError(500, "Internal Server Error", error));
  }
};

//Retreive a merchant's data by their ID.
//Finds the merchant by their ID, then returns the merchant to the front-end.
export const getMerchantById = async (req, res, next) => {
  try {
    const merchant = await User.findById(req.params.id).select("-password");
    res.status(200).json({ merchant });
  } catch (error) {
    return next(CreateError(500, "Internal Server Error", error));
  }
};

//Accept a merchant according to their ID.
//once accepted, a new temporary password will be created and sent to the merchant's email.
export const acceptMerchant = async (req, res, next) => {
  try {
    //Find the merchant first.
    const merchantId = req.query.id;
    const merchant = await User.findById(merchantId);
    //Generates a random password.
    const merchantNewTempPassword = Randomstring.generate(8);
    //Hash the password using bcrypt salt 10
    const salt = await bcrypt.genSalt(10);
    const merchantHashedPw = await bcrypt.hash(merchantNewTempPassword, salt);

    if (!merchant) {
      return next(CreateError(404, "Merchant not found"));
    }
    //Merchant account created here.
    merchant.password = merchantHashedPw;
    merchant.accountStatus = "approved";
    await merchant.save();
    //Send the confirmation email to the merchant.
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

//Rejects a merchant according to their ID.
export const rejectMerchant = async (req, res, next) => {
  try {
    //Find the merchant first
    const merchantId = req.query.id;
    const merchant = await User.findById(merchantId);
    if (!merchant) {
      return next(CreateError(404, "Merchant not found"));
    }

    //Change the account status to rejected.
    merchant.accountStatus = "rejected";

    //Saves the merchant to the database.
    try {
      await merchant.save();
    } catch (error) {
      return next(CreateError(500, "Error Saving Merchant", error));
    }
    //Sends rejection email to the merchant.
    try {
      await rejectEmail(merchant);
    } catch (error) {
      return next(CreateError(500, "Error Sending Email", error));
    }
    return next(CreateSuccess(200, "Merchant rejected Successfully"));
  } catch (error) {
    return next(CreateError(500, "Internal Server Error", error));
  }
};

//Retreive the number of registered merchants.
export const getNumberOfMerchants = async (req, res, next) => {
  try {
    //Finds the number of users with the role of merchant.
    const merchants = await User.find({ roles: "merchant" });
    const numberOfMerchants = merchants.length;
    return next(CreateSuccess(200, "Number of Merchants", numberOfMerchants));
  } catch (error) {
    return next(CreateError(500, "Internal Server Error", error));
  }
}

//Retreive the number of registered users.
export const getNumberOfUsers = async (req, res, next) => {
  try {
    //Finds the number of users with the role of user.
    const users = await User.find({ roles: "user" });
    const numberOfUsers = users.length;
    return next(CreateSuccess(200, "Number of Users", numberOfUsers));
  } catch (error) {
    return next(CreateError(500, "Internal Server Error", error));
  }
}