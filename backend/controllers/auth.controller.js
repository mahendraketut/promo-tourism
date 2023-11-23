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
        return next(CreateError(400, "Email already exists"));
        }
        else{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const roleType = req.body.roles;
            if(roleType == 'admin'){
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword,
                    roles: "admin",
                    phoneNo: req.body.phoneNo,
                });
                await newUser.save();
                return next(CreateSuccess(200, "User registered successfully!"));
            }
            else if(roleType == 'user'){
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword,
                    roles: "user",
                    phoneNo: req.body.phoneNo,
                    address: req.body.address,
                });
                await newUser.save();
                return next(CreateSuccess(200, "User registered successfully!"));
            }
            else if(roleType == 'merchant'){
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword,
                    roles: "merchant",
                    phoneNo: req.body.phoneNo,
                    description: req.body.description,
                    //add file handling afterwards
                });
                await newUser.save();
                return next(CreateSuccess(200, "User registered successfully!"));
            }
            else{
                return next(CreateError(400, "Invalid Role!"));
            }
        }
    } catch (error) {
        // return res.status(500).send(error);
        return next(CreateError(500, error));
    }
};

export const login = async (req, res, next) => {
    //process the login
    try {
        //this also fetches the roles
        const user = await User.findOne({email: req.body.email}).populate("roles", "role");
        const {roles} = user;
        //TODO: delete console logging once done.
        //Console log finding user
        console.log("nyari user sama roles");
        console.log(user);
        console.log(roles);
        console.log("sukses nyari role sama user");
        if (!user) {
            return next(CreateError(400, "Email is not found"));
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return next(CreateError(400, "Invalid password"));
        }
        
        const token = jwt.sign({id: user._id, roles:roles}, 
            process.env.TOKEN_SECRET);
        console.log("token created");
        res.cookie("access_token", token, {
            httpOnly: true} ).status(200).json({
                message: "Logged in successfully!",
                token: token,
                roles: roles,
                //Nanti ini data di delete, kalau perlu user sebiji, cari aja sendiri.
                data:user,
            });
        

    } catch (error) {
      
        return next(CreateError(500, error));
    }
};