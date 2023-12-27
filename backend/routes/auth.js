//Routes for authentication

import express from "express";
import { checkEmail, register, login, changePassword, forgetPassword, validateVerificationCode, getMerchants, acceptMerchant, rejectMerchant, getMerchantById } from "../controllers/auth.controller.js";
import bodyParser from "body-parser";
//import { checkEmail, register, login, logout, changePassword, forgetPassword, validateVerificationCode, getMerchants, acceptMerchant, rejectMerchant, getMerchantById } from "../controllers/auth.controller.js";

const router = express.Router();

// Apply bodyParser only to routes that requires it
const jsonParser = bodyParser.json();

// Use jsonParser only on specific routes
router.post('/check', jsonParser, checkEmail);
router.post('/register', register);
router.post('/login', jsonParser, login);
// router.post('/logout', logout); 
router.patch('/changepassword', jsonParser, changePassword);
router.post('/forgetpassword', jsonParser, forgetPassword);
router.post('/val', jsonParser, validateVerificationCode);
router.get('/merchants', getMerchants);
router.post('/accept', jsonParser, acceptMerchant);
router.post('/reject', jsonParser, rejectMerchant);
router.get('/merchant/:id', jsonParser, getMerchantById);

export default router;
