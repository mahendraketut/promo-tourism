import Role from "../models/Role.js";
//TODO: bersihin response handling yang lama nanti
export const createRole = async (req, res, next) => {
    try {
        if(req.body.role && req.body.role !== ""){
            const newRole = new Role(req.body);
            await newRole.save();
            // return res.send("Role Created");
            return next(CreateSuccess(200, "Role Created"));
        }
        else{
            // return res.status(400).send("Enter a valid role!");
            return next(CreateError(400, "Invalid Role"));
        }
    } catch (error) {
        // return res.status(500).send("Internal Server error!");
        return next(CreateError(500, error));

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
                // return res.status(200).send("Role Updated!");
                return next(CreateSuccess(200, "Role Updated"));
            }
            else{
                // return res.status(404).send("Not Found");
                return next(CreateError(404, "Not Found"));
            }
        }
        else{
            // return res.status(404).send("Not Found!");
            return next(CreateError(404, "Not Found"));
        }
    } catch (error) {
        // return res.status(500).send("Internal Server error!");
        return next(CreateError(500, error));
    }
};

export const getAllRoles = async (req, res, next) => {
    try {
        // {} means all without filters
        const roles = await Role.find({});
        // return res.status(200).send(roles);
        return next(CreateSuccess(200, roles));
    } catch (error) {
        // return res.status(500).send("Internal Error!");
        return next(CreateError(500, error));
    
    }
};

export const deleteRole = async (req, res, next) => {
    try {
        const role = await Role.findById( {_id: req.params.id});
        if(role){
            await Role.findByIdAndDelete(req.params.id);
            // return res.status(200).send("Role Deleted!");
            return next(CreateSuccess(200, "Role Deleted"));
        }
        else{
            // return res.status(404).send("Not Found");
            return next(CreateError(404, "Not Found"));
        }
    } catch (error) {
        // return res.status(500).send("Internal Server error!");
        return next(CreateError(500, error));
    }
};