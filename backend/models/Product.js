import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        max: 255,
    },
    price:{
        type: Number,
        required: true,
    },
    quantity:{
        type: Number,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    disount:{
        type: Number,
    },
    category:{
        type: String,
    },
    coverImage:
    {
        type: String,
        // required: true,
    },
    images:[{
        type: String,
        // required: true,
    }],



});

export default mongoose.model("Product", ProductSchema);