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
    imagesPath:[{
        type: String,
    }],
    coverImagePath:{
        type: String,
    },
    owner:{
        type: String,
    },
});

export default mongoose.model("Product", ProductSchema);