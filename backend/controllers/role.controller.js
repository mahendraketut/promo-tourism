import Role from "../models/Role.js";

export const createRole = async (req, res, next) => {
    try {
        if(req.body.role && req.body.role !== ""){
            const newRole = new Role(req.body);
            await newRole.save();
            return res.send("Role Created");
        }
        else{
            return res.status(400).send("Enter a valid role!");
        }
    } catch (error) {
        return res.status(500).send("Internal Server error!");
    }
};


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
                return res.status(200).send("Role Updated!");
            }
            else{
                return res.status(404).send("Not found");
            }
        }
        else{
            return res.status(404).send("Not FOund!");
        }
    } catch (error) {
        return res.status(500).send("Internal Server error!");
    }
};

export const getAllRoles = async (req, res, next) => {
    try {
        // {} means all without filters
        const roles = await Role.find({});
        return res.status(200).send(roles);
    } catch (error) {
        return res.status(500).send("Internal Error!");
    }
};

export const deleteRole = async (req, res, next) => {
    try {
        const role = await Role.findById( {_id: req.params.id});
        if(role){
            await Role.findByIdAndDelete(req.params.id);
            return res.status(200).send("Role Deleted!");
        }
        else{
            return res.status(404).send("Not found");
        }
    } catch (error) {
        return res.status(500).send("Internal Server error!");
    }
};