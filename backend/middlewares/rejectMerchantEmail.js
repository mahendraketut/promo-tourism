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

//Reads the merchant rejection template
const readEmailTemplate = (userData,currentPassword, callback) => {
    const emailTemplatePath = join(__dirname, '../templates/merchantRejected.html')
    fs.readFile(emailTemplatePath, 'utf8', (err, html) => {
        if (err) {
            callback(err);
        } else {
            html = html.replace('{{name}}', userData.name);
            callback(null, html);
        }
    });
}

//Sends the rejection email.
export const rejectEmail = (userData, currentPassword) => {
    readEmailTemplate(userData, currentPassword, (err, replacedHtmlEmail) => {
        if (err) {
            return response.CreateError(500, "Error reading email template");
        } else {
            transporter.sendMail({
                from: process.env.EMAIL_SENDER,
                to: userData.email,
                subject: "Application Update from PRS Tours",
                html: replacedHtmlEmail,
            }).catch((err) => {
                return response.CreateError(500, "Error sending email", err);
            });
        }
    });
};

export default rejectEmail;
