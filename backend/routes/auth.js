import express from "express";
import { register } from "../controllers/auth.controller";
const router = express.Router();

//reg
router.post('/register', (req, res) => {
    res.send("Register");
});