import User from '../models/User.js';
import Role from '../models/Role.js';
import bcrypt from 'bcryptjs';
import { response } from 'express';
import { CreateError } from '../utils/error.js';
import { CreateSuccess } from '../utils/success.js';


import jwt from 'jsonwebtoken';

//TODO: register error handling perlu diperbaikin, biar bisa di acc front end.
export const register = async (req, res, next) => {
    try {
        //cari user udah ada apa belom
        const doesEmailExist = await User.findOne({ email: req.body.email});
        if (doesEmailExist) {
        // return res.status(400).send("Email already exists");
        return next(CreateError(400, "Email already exists"));
        }
        else{
            const role = await Role.find({role: 'User'});
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                roles: role.map(role => role._id),
                address: req.body.address,
                isAdmin: false,
                
            });
            await newUser.save();
            // return res.status(200).send("User registered successfully!");
            return next(CreateSuccess(200, "User registered successfully!"));
        }
    } catch (error) {
        // return res.status(500).send(error);
        return next(CreateError(500, error));
    }
};

export const login = async (req, res, next) => {
    //process the login
    try {
        console.log("masuk login");
        //this also fetches the roles
        const user = await User.findOne({email: req.body.email}).populate("roles", "role");
        const {roles} = user;
        console.log("nyari user sama roles");
        console.log(user);
        console.log(roles);
        console.log("sukses nyari role sama user");
        if (!user) {
            return next(CreateError(400, "Email is not found"));
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            // return res.status(400).send("Invalid password");
            return next(CreateError(400, "Invalid password"));
        }
        console.log("psw valid");
        
        const token = jwt.sign({id: user._id, roles:roles, isAdmin: user.isAdmin}, 
            process.env.TOKEN_SECRET);
        console.log("token created");
        res.cookie("access_token", token, {
            httpOnly: true} ).status(200).json({
                message: "Logged in successfully!",
                token: token,
                isAdmin: user.isAdmin,
                roles: roles,
                data:user,
            });
        // return next(CreateSuccess(200, "Logged in successfully!"));

    } catch (error) {
        // return res.status(500).send(error);
        return next(CreateError(500, error));
    }
};