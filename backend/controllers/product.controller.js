import Product from "../models/Product.js";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from 'uuid';

//Used to rename the file and move it to the productimg folder.
const moveAndRenameFile = (fileArray, targetDir) => {
  
    //Checks if array received is not empty or invalid.
    if (!fileArray || fileArray.length === 0 || !fileArray[0]) {
        console.error("File array is empty or invalid.");
        return undefined;
    }
    const file = fileArray[0];
    //Checks if the file object is valid and has the required properties.
    if (!file.filepath || !file.newFilename) {
        console.error("Invalid file object or missing properties.");
        return undefined;
    }
    //Retreives the new file path, then change the name to the new file name.
    const currentFilePath = file.filepath;
    const currentFileName = file.newFilename;
    //Retreives the file extension from the file name.
    const fileExtension = path.extname(currentFileName);
    //Creates a unique file name using uuidv4, then add the extension again.
    const uniquePrefix = uuidv4();
    const newFileName = uniquePrefix + fileExtension;

    //Creates the target path using the target directory and the new file name.
    const targetPath = path.join(targetDir, newFileName);

    //Moves the images from the temp path to the new path (productimg folder).
    fs.copyFileSync(currentFilePath, targetPath);
    fs.unlinkSync(currentFilePath);
    return newFileName;
};

//Creates a new product into the database.
export const addProduct = async (req, res, next) => {
    //Sets the upload directory to the productimg folder.
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const uploadDir = path.join(__dirname, '..', 'productimg');

    //Creates the upload directory if it does not exist yet/
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    //Creates a new form object using formidable.
    const form = formidable({
        multiples: true,
        uploadDir,
        keepExtensions: true
    });
    //Parses the request body.
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Form parse error:", err);
            return next(CreateError(500, "File upload failed", err));
        }
        //Retreives data from the fields object, without having to manually do them one-by-one.
        const getFieldValue = (fieldValue) => Array.isArray(fieldValue) ? fieldValue[0] : fieldValue;

        //Creates a new product object using the data retreived from the fields object.
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

        //Process cover image if present (for files.coverImagePath and files.cover)
        if (files.coverImagePath) {
            //Sends the cover image to the moveAndRenameFile function to be processed.
            //The new file name will be saved into the db.
            product.coverImagePath = moveAndRenameFile(files.coverImagePath, uploadDir);
        } else if (files.cover) {
            //Same function as above, but for reduncancy.
            product.coverImagePath = moveAndRenameFile(files.cover, uploadDir);
        }

        //Process product images if present
        //Sends the images to the moveAndRenameFile function to be processed.
        //The new images names will be saved into the db as an array.
        product.imagesPath = Object.keys(files)
            .filter(key => key.startsWith('images[')) // Filter keys that start with 'images['
            .map(key => moveAndRenameFile(files[key], uploadDir)) // Process each image file
            .filter(Boolean); 
        try {
            //Saves the product into the database.
            const savedProduct = await product.save();
            res.status(200).json(savedProduct);
        } catch (error) {
            console.error("Error saving product:", error);
            next(CreateError(500, "Error saving product", error));
        }
    });
};


//Retreives all the products from the database without any filters.
//Used by admin/officer and also users to view all products.
export const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find({});
        return next(CreateSuccess(200, "Products listed",products));
    } catch (error) {
        return next(CreateError(500, error));
    }
}

//Retreives a single product from the database.
//Filters the product by the product ID.
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


//Updates product according to the request send from the front-end
export const updateProduct = async (req, res, next) => {
    //Again, sets the file directory.
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const uploadDir = path.join(__dirname, '..', 'productimg');
  
    const form = formidable({
      multiples: true,
      uploadDir,
      keepExtensions: true
    });
    //Parses the request body to get the data.
    form.parse(req, async (err, fields, files) => {
        console.log("fields", fields);
      if (err) {
        console.error("Form parse error:", err);
        return next(CreateError(500, "Could not update product", err));
      }
      //Retreives data from the fields object, without having to manually do them one-by-one.
      const getFieldValue = (fieldValue) => Array.isArray(fieldValue) ? fieldValue[0] : fieldValue;
      try {
        //Find the product according to the ID sent from the front-end.
        const product = await Product.findById(req.params.id);
        if (!product) {
          return next(CreateError(404, "Product not found"));
        }
        //Replace images if requested.
        //Remove files from the filesystem first, then clear the imagesPath array.
        if (fields.changeImages == 'true') {      
            console.log      
            product.imagesPath.forEach(imagePath => {
              const fullPath = path.join(uploadDir, imagePath);
              try {
                if (fs.existsSync(fullPath)) {
                  fs.unlinkSync(fullPath);
                } else {
                    console.warn(`File not found: ${fullPath}`);
                }
              } catch (error) {
                console.error(`Error deleting file: ${fullPath}`, error);
              }
            });
            //Clear the imagesPath array
            product.imagesPath.splice(0, product.imagesPath.length);
            product.markModified('imagesPath'); // Inform Mongoose that the array has changed
            //Process new images if present
            //Sends the images to the moveAndRenameFile function to be processed.
            product.imagesPath = Object.keys(files)
            .filter(key => key.startsWith('images[')) // Filter keys that start with 'images['
            .map(key => moveAndRenameFile(files[key], uploadDir)) // Process each image file
            .filter(Boolean);  
        }
  
        //Process new cover image if present
        let coverImagePath;
        if (files.cover) {
        //Sends the cover image to the moveAndRenameFile function to be processed.
          coverImagePath = moveAndRenameFile(files.cover, uploadDir);
          product.coverImagePath = coverImagePath; // Set new cover image path
        }
  
         
        //Update other fields
        product.name = getFieldValue(fields.name) || product.name;
        product.price = parseFloat(getFieldValue(fields.price)) || product.price;
        product.quantity = parseInt(getFieldValue(fields.quantity), 10) || product.quantity;
        product.description = getFieldValue(fields.description) || product.description;
        product.category = getFieldValue(fields.category) || product.category;
        product.owner = getFieldValue(fields.owner) || product.owner;
        product.markModified('imagesPath');
  
        //Saves the updated product to the backend.
        const updatedProduct = await product.save();
        return next(CreateSuccess(200, "Product updated", updatedProduct));
      } catch (error) {
        console.error("Error updating product:", error);
        return next(CreateError(500, "Error updating product", error));
      }
    });
};
  
//Deletes the product according to the product ID sent from the front-end.
export const deleteProduct = async (req, res, next) => {
    //Finds the product by ID, then delete it.
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

//retreives product accotding to the owner's user id.
//Used by merchants to retreive their products.
export const getProductsByUserId = async (req, res, next) => {
    try {
        const products = await Product.find({owner: req.params.id});
        return next(CreateSuccess(200, "Products listed",products));
    } catch (error) {
        return next(CreateError(500, error));
    }
}