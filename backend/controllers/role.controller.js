import Role from "../models/Role.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";

//Adds role to database
export const createRole = async (req, res, next) => {
    try {
        if(req.body.role && req.body.role !== ""){
            const newRole = new Role(req.body);
            await newRole.save();
            return next(CreateSuccess(200, "Role Created"));
        }
        else{
            return next(CreateError(400, "Invalid Role"));
        }
    } catch (error) {
        return next(CreateError(500, error));

    }
};

//Updates role according to the request send from the front-end
export const updateRole = async (req, res, next) => {
    try {
        const role = await Role.findById( {_id: req.params.id});
        if(role){
            const newData = await Role.findByIdAndUpdate(
                req.params.id,
                {$set: req.body},
                console.log(req.body),
                {new: true},
            );
            
            if(newData){
                return next(CreateSuccess(200, "Role Updated"));
            }
            else{
                return next(CreateError(404, "Not Found"));
            }
        }
        else{
            return next(CreateError(404, "Not Found"));
        }
    } catch (error) {
        return next(CreateError(500, error));
    }
};

//Retreives all the roles from the database
export const getAllRoles = async (req, res, next) => {
    try {
        // {} means all without filters
        const roles = await Role.find({});
        return next(CreateSuccess(200,"showing all roles" ,roles));
    } catch (error) {
        return next(CreateError(500, error));
    
    }
};

//Delets a role according to the role ID sent from the front-end
export const deleteRole = async (req, res, next) => {
    try {
        const role = await Role.findById( {_id: req.params.id});
        if(role){
            await Role.findByIdAndDelete(req.params.id);
            return next(CreateSuccess(200, "Role Deleted"));
        }
        else{
            return next(CreateError(404, "Not Found"));
        }
    } catch (error) {
        return next(CreateError(500, error));
    }
};