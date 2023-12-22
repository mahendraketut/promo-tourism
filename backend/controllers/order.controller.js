import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
// import { sendEmail } from '../services/email.service';

import { CreateSuccess } from '../utils/success.js';
import { CreateError } from '../utils/error.js';



export const createOrder = async (req, res) => {
    // const { userId, productId, total, invoiceNumber, paypalInfo } = req.body;
    // const { userId } = req.params;
    console.log("Create order kepanggil: ", req.body);

    const user = await User.findById(req.body.userId);
    console.log("user: ", user);
    if (!user) return res.status(404).json(CreateError('User not found'));
    const product = await Product.findById(req.body.productId);
    console.log("product: ", product);
    if(!product) return res.status(404).json(CreateError('Product not found'));
    const total = req.body.total;
    const invoiceNumber = req.body.invoice;
    const paypalInfo = req.body.paypalInfo;
    const merchantId = product.owner;
    //Ganti sesuai dengan paypalnya
    const paymentStatus = req.body.paymentStatus;
    console.log("payment status", paymentStatus);

    console.log("masuk new order");
    const newOrder = new Order({
        userId: user._id,
        productId: product._id,
        merchantId: merchantId,
        total: total,
        status: paymentStatus,
        invoiceNumber: invoiceNumber,
        paypalInfo: paypalInfo,
    });
    console.log("DISINI NEW ORDER:", newOrder);
    console.log("quantity lama", product.quantity);
    product.quantity = product.quantity - req.body.quantity;
    console.log("qwantity: ", product.quantity);    
    try {
        console.log("masuk trycatch");
        const savedOrder = await newOrder.save();
        console.log("saved order", savedOrder);
        const savedProduct = await product.save();
        console.log("saved product", savedProduct);

        return res.status(200).json(CreateSuccess(200, "Order created", savedOrder));
    } catch (error) {
        console.log(error);
        return res.status(500).json(CreateError(500, "Cannot create order", error))
        // return next(CreateError(500, "Cannot create order", error))
    }
};

export const getOrders = async (req, res) => {  
    try {
        const orders = await Order.find();
        return res.status(200).json(CreateSuccess(orders));
    } catch (error) {
        return res.status(500).json(CreateError(error));
    }
};

export const getOrderById = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await Order.findById(orderId);
        return res.status(200).json(CreateSuccess(order));
    } catch (error) {
        return res.status(500).json(CreateError(error));
    }
};

export const getOrderbyUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const order = await Order.find({userId: userId});
        return res.status(200).json(CreateSuccess(order));
    } catch (error) {
        return res.status(500).json(CreateError(error));
    }
};

export const getOrderByMerchantId = async (req, res) => {
    const { merchantId } = req.params;
    try {
        const order = await Order.find({merchantId: merchantId});
        return res.status(200).json(CreateSuccess(order));
    } catch (error) {
        return res.status(500).json(CreateError(error));
    }
}