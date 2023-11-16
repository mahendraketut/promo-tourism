import Product from "../models/Product.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";


export const createProduct = async (req, res, next) => {
    try {
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            description: req.body.description,
            discount: req.body.discount,
            category: req.body.category,
            coverImage: req.body.coverImage,
            images: [req.body.images],
        });
        await product.save();
        return next(CreateSuccess(200, "Product created successfully"));
    } catch (error) {
        return next(CreateError(500, error));
    }
}



export const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find({});
        return next(CreateSuccess(200, "Products listed",products));
    } catch (error) {
        return next(CreateError(500, error));
    }
}


export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            return next(CreateSuccess(200,"Product Found!", product));
        }
        else{
            return next(CreateError(404, "Product not found"));
        }
    } catch (error) {
        return next(CreateError(500, error));
    }
}


export const updateProduct = async (req, res, next) => {
    try {
        console.log("update pak ekooo");
        const product = await Product.findById(req.params.id);
        if(product){
            const newData = await Product.findByIdAndUpdate(
                req.params.id,
                {$set: req.body},
                {new: true},
            );
            if(newData){
                return next(CreateSuccess(200, "Product Updated"));
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
}

export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            await Product.findByIdAndDelete(req.params.id);
            return next(CreateSuccess(200, "Product Deleted"));
        }
        else{
            return next(CreateError(404, "Not Found"));
        }
    } catch (error) {
        return next(CreateError(500, error));
    }
}