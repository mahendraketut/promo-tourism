import express from "express";
import { register, login, logout, changePassword, forgetPassword} from "../controllers/auth.controller.js";
const router = express.Router();

//reg
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.patch('/changepassword', changePassword);
router.post('/forgetpassword', forgetPassword);


export default router;