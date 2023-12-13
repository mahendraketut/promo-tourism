import express from "express";
import { checkEmail, register, login, logout, changePassword, forgetPassword, validateVerificationCode, getMerchants, acceptMerchant, rejectMerchant } from "../controllers/auth.controller.js";
import bodyParser from "body-parser";

const router = express.Router();

// Apply bodyParser only to routes that require it
const jsonParser = bodyParser.json();

// Use jsonParser only on specific routes
router.post('/check', jsonParser, checkEmail);
router.post('/register', register); // register will use formidable, no bodyParser needed here
router.post('/login', jsonParser, login);
router.post('/logout', logout); // This route may not need bodyParser
router.patch('/changepassword', jsonParser, changePassword);
router.post('/forgetpassword', jsonParser, forgetPassword);
router.post('/val', jsonParser, validateVerificationCode);
router.get('/merchants', getMerchants); // This is a GET request, typically no bodyParser needed
router.post('/accept', jsonParser, acceptMerchant);
router.post('/reject', jsonParser, rejectMerchant);

export default router;
