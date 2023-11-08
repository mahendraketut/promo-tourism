import User from '../models/User.js';
import Role from '../models/Role.js';


export const register = async (req, res, next) => {
    try {
        console.log("nyari user");
        const role = await Role.find({role: 'User'});
        console.log("masuk register");
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            roles: role.map(role => role._id),
            address: req.body.address,
            isAdmin: false,
            
        });
        await newUser.save();
        return res.status(200).send("User registered successfully!");
    } catch (error) {
        console.log(error);
    }
};