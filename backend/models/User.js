import mongoose, {Schema} from "mongoose";

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
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
        type: Boolean,
        default: false
    },
    address: {
        type: String,
        max: 80
    },
    firstName: {
        type: String,
        max: 20
    },
    lastName: {
        type: String,
        max: 20
    },
    roles:{
        type: [Schema.Types.ObjectId],
        ref: "Role",
        required: true
    }

}, {timestamps: true});


export default mongoose.model("User", UserSchema);
