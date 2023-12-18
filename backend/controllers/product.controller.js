import Product from "../models/Product.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

//this is used to randomize the image name
import { v4 as uuidv4 } from 'uuid';

export const addProduct = async (req, res, next) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const uploadDir = path.join(__dirname, "productimg");

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }


    const form = formidable({
        multiples: true,
        uploadDir,
        keepExtensions: true
    });
    

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Form parse error:", err);
            return next(CreateError(500, "File upload failed", err));
        }

        const getFieldValue = (fieldValue) => Array.isArray(fieldValue) ? fieldValue[0] : fieldValue;

        // Move and rename file function
        const moveAndRenameFile = (fileArray, targetDir) => {
            // Ensure that fileArray is not empty and has a file object
            if (!fileArray || fileArray.length === 0 || !fileArray[0]) {
                console.error("File array is empty or invalid.");
                return undefined;
            }
        
            const file = fileArray[0];
            console.log(`Received file object:`, file);
        
            // Check if the file object is valid
            if (!file.filepath || !file.newFilename) {
                console.error("Invalid file object or missing properties.");
                return undefined;
            }
        
            // Use the current filepath and filename
            const currentFilePath = file.filepath;
            const currentFileName = file.newFilename;
            console.log(`Current file path: ${currentFilePath}`);
            console.log(`Current file name: ${currentFileName}`);
        
            // Extract the file extension from the current filename
            const fileExtension = path.extname(currentFileName);
            console.log(`File extension: ${fileExtension}`);
        
            // Create a unique file name
            const uniquePrefix = uuidv4();
            const newFileName = uniquePrefix + fileExtension;
            console.log(`New filename: ${newFileName}`);
        
            // Construct the target path for the new file
            const targetPath = path.join(targetDir, newFileName);
            console.log(`Target path: ${targetPath}`);
        
            // Move the file to the new path
            fs.copyFileSync(currentFilePath, targetPath);
            fs.unlinkSync(currentFilePath);
        
            return targetPath;
        };

        // Initialize product with fields
        const product = new Product({
            name: getFieldValue(fields.name),
            price: parseFloat(getFieldValue(fields.price)),
            quantity: parseInt(getFieldValue(fields.quantity), 10),
            description: getFieldValue(fields.description),
            category: getFieldValue(fields.category),
            imagesPath: [],
            coverImagePath: '',
            owner: getFieldValue(fields.owner),
        });

        // Process cover image if present (for files.coverImagePath and files.cover)
        if (files.coverImagePath) {
            product.coverImagePath = moveAndRenameFile(files.coverImagePath, uploadDir);
        } else if (files.cover) {
            product.coverImagePath = moveAndRenameFile(files.cover, uploadDir);
        }

        // Process additional images if present
        product.imagesPath = Object.keys(files)
            .filter(key => key.startsWith('images[')) // Filter keys that start with 'images['
            .map(key => moveAndRenameFile(files[key], uploadDir)) // Process each image file
            .filter(Boolean); 

        console.log("Attempting to save product:", product);

        try {
            const savedProduct = await product.save();
            console.log("Product saved:", savedProduct);
            res.status(200).json(savedProduct);
        } catch (error) {
            console.error("Error saving product:", error);
            next(CreateError(500, "Error saving product", error));
        }
    });
};



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
export const updateProductv1 = async (req, res, next) => {
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

export const updateProduct = async (req, res, next) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const uploadDir = path.join(__dirname, "productimg");
  
    const form = formidable({
      multiples: true,
      uploadDir,
      keepExtensions: true
    });
  
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parse error:", err);
        return next(CreateError(500, "Could not update product", err));
      }
  
      const getFieldValue = (fieldValue) => Array.isArray(fieldValue) ? fieldValue[0] : fieldValue;
  
      try {
        const product = await Product.findById(req.params.id);
        if (!product) {
          return next(CreateError(404, "Product not found"));
        }
  
        // Move and rename file function is same as in addProduct
  
        // Update cover image if present (for files.coverImagePath and files.cover)
        let coverImagePath;
        if (files.coverImagePath) {
          coverImagePath = moveAndRenameFile(files.coverImagePath, uploadDir);
        } else if (files.cover) {
          coverImagePath = moveAndRenameFile(files.cover, uploadDir);
        }
  
        // Update additional images if present
        let imagesPath;
        if (files.images) {
          imagesPath = Object.keys(files)
            .filter(key => key.startsWith('images[')) // Filter keys that start with 'images['
            .map(key => moveAndRenameFile(files[key], uploadDir)) // Process each image file
            .filter(Boolean);
        }
  
        // Update the product with new fields
        product.name = getFieldValue(fields.name) || product.name;
        product.price = parseFloat(getFieldValue(fields.price)) || product.price;
        product.quantity = parseInt(getFieldValue(fields.quantity), 10) || product.quantity;
        product.description = getFieldValue(fields.description) || product.description;
        product.category = getFieldValue(fields.category) || product.category;
        product.owner = getFieldValue(fields.owner) || product.owner;
  
        // Update images if new ones were uploaded
        if (coverImagePath) {
          product.coverImagePath = coverImagePath;
        }
        if (imagesPath && imagesPath.length > 0) {
          product.imagesPath = imagesPath;
        }
  
        const updatedProduct = await product.save();
        console.log("Product updated:", updatedProduct);
        return next(CreateSuccess(200, "Product updated", updatedProduct));
      } catch (error) {
        console.error("Error updating product:", error);
        return next(CreateError(500, "Error updating product", error));
      }
    });
  };
  

//Deletes the product according to the product ID sent from the front-end.
export const deleteProduct = async (req, res, next) => {
    console.log("masuk delete bro");
    try {
        console.log("params id: ", req.params.id);
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

//retreives product accotding to the owner's user id

export const getProductsByUserId = async (req, res, next) => {
    try {
        const products = await Product.find({owner: req.params.id});
        console.log("#####################################################");
        console.log("req.params.userId", req.params.id);
        console.log("#####################################################");
        console.log("retreived products", products);
        return next(CreateSuccess(200, "Products listed",products));
    } catch (error) {
        return next(CreateError(500, error));
    }
}