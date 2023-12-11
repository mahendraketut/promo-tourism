import express from "express";
import {checkEmail, register, login, logout, changePassword, forgetPassword, validateVerificationCode, getMerchants, acceptMerchant, rejectMerchant} from "../controllers/auth.controller.js";
const router = express.Router();

//reg
router.post('/check', checkEmail);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.patch('/changepassword', changePassword);
router.post('/forgetpassword', forgetPassword);
router.post('/val', validateVerificationCode);
router.get('/merchants', getMerchants);
router.post('/accept', acceptMerchant);
router.post('/reject', rejectMerchant);


export default router;