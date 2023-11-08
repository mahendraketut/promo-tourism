import User from '../models/User.js';
import Role from '../models/Role.js';
import bcrypt from 'bcryptjs';
import { response } from 'express';


//TODO: register error handling perlu diperbaikin, biar bisa di acc front end.
export const register = async (req, res, next) => {
    try {
        console.log("nyari user");
        //cari user udah ada apa belom
        const doesEmailExist = await User.findOne({ email: req.body.email});
        if (doesEmailExist) {
        return res.status(400).send("Email already exists");
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
            return res.status(200).send("User registered successfully!");
        }
    } catch (error) {
        return res.status(500).send(error);
    }
};