import Product from "../models/Product.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";
// import multer from "multer";

//Creates a new product then adds it to the database.
export const createProduct = async (req, res, next) => {
    console.log("masuk create1");
    try {
        alert("hello");
        alert(JSON.stringify(req.body, null, 2));
        let imagePaths = [];
        if (req.files && req.files.length > 0) {
            const imagePaths = req.files.map(file => ({ url: file.path }));
        }
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            description: req.body.description,
            discount: req.body.discount,
            category: req.body.category,
            coverImage: req.body.coverImage,
            images: imagePaths,
        });
        await product.save();
        return next(CreateSuccess(200, "Product created successfully"));
    } catch (error) {
        return next(CreateError(500, error));
    }
}

//Retreives all the products from the database.
export const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find({});
        return next(CreateSuccess(200, "Products listed",products));
    } catch (error) {
        return next(CreateError(500, error));
    }
}

//Retreives a single product from the database.
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

//Updates product according to the request send from the front-end.
export const updateProduct = async (req, res, next) => {
    try {
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

//Deletes the product according to the product ID sent from the front-end.
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