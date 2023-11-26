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
        default: 'user'
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

}, {timestamps: true});


export default mongoose.model("User", UserSchema);
