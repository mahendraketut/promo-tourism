import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
dotenv.config();


//Creates a transporter for sending emails.
//Retreives attributes from the ENV file.
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Reads the email template from the back-end
const readEmailTemplate = (userData, verificationCode, callback) => {
    const emailTemplatePath = join(__dirname, '../templates/forgetPassword.html')
    fs.readFile(emailTemplatePath, 'utf8', (err, html) => {
        if (err) {
            callback(err);
        } else {
            html = html.replace('{{name}}', userData.name);
            html = html.replace('{{verificationCode}}', verificationCode);
            callback(null, html);
        }
    });
}
//Send the verification email.
export const sendVerificationEmail = (userData, verificationCode) => {
    readEmailTemplate(userData, verificationCode, (err, replacedHtmlEmail) => {
        if (err) {
            return response.CreateError(500, "Error reading email template");
        } else {
            transporter.sendMail({
                from: process.env.EMAIL_SENDER,
                to: userData.email,
                subject: "PRS TOURS FORGET PASSWORD",
                html: replacedHtmlEmail,
            }).catch((err) => {
                return response.CreateError(500, "Error sending email", err);
            });
        }
    });
};

