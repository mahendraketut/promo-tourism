//This is the backend model for User.

import mongoose, {Schema} from "mongoose";

const UserSchema = mongoose.Schema({
    
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    address: {
        type: String,
        max: 80
    },
    name: {
        required: true,
        type: String,
        max: 40
    },
    roles:{
        required: true,
        type: String,
        max: 40,
    },
    phoneNo:{
        type: String,
        max: 20,
        required: true,
    },
    description:{
        type: String,
        max: 300,
    },
    resetPasswordCode:{
        type: String,
        max: 10,
    },
    accountStatus:{
        type: String,
        max: 10,
        default: "approved",
    },
    licenseDescription: {
        type: String,
        max: 100,
    },
    reviewsDescription: {
        type: String,
        max: 100,
    },
    licensePath: {
        type: String,
        max: 256,
    },
    reviewsPath: {
        type: String,
        max: 256,
    },
    hasResetPassword: {
        type: Boolean,
        default: false,
    },


}, {timestamps: true});


export default mongoose.model("User", UserSchema);
