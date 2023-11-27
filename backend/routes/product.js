import express from "express";
import upload from '../utils/multerConfig.js';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controllers/product.controller.js";


const router = express.Router();


// router.post('/create', createProduct);
//TODO: check img upload
router.post('/create', upload.array('images', 5), createProduct);
router.get('/', getAllProducts);
router.get('/get/:id', getProductById);
router.patch('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);


export default router;