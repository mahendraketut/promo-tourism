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
    isAdmin: {
        required: true,
        type: Boolean,
        default: false
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
        type: [Schema.Types.ObjectId],
        ref: "Role",
        required: true,
        default: ['user']
    }

}, {timestamps: true});


export default mongoose.model("User", UserSchema);
