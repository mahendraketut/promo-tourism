import mongoose from "mongoose";


const ImageSchema = mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    isCover: {
        type: Boolean,
        default: false,
    },
});

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
    images: [ImageSchema],



});

export default mongoose.model("Product", ProductSchema);