import express from "express";
// import upload from '../utils/multerConfig.js';
import { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controllers/product.controller.js";


const router = express.Router();

router.get('/', getAllProducts);
router.get('/get/:id', getProductById);
router.patch('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);
router.post('/add', addProduct);


export default router;