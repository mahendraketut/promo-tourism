import Order from '../models/order.model';
import Product from '../models/product.model';
import User from '../models/user.model';
// import { sendEmail } from '../services/email.service';

import { CreateSuccess } from '../utils/success';
import { CreateError } from '../utils/error';



export const createOrder = async (req, res) => {
    // const { userId, productId, total, invoiceNumber, paypalInfo } = req.body;
    // const { userId } = req.params;

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json(CreateError('User not found'));
    const product = await Product.findById(req.body.productId);
    if(!product) return res.status(404).json(CreateError('Product not found'));
    const total = req.body.total;
    const invoiceNumber = req.body.invoiceNumber;
    const paypalInfo = [req.body.paypalInfo];
    const merchantId = product.owner;
    //Ganti sesuai dengan paypalnya
    paymentStatus = paypalInfo.paymentStatus;

    const newOrder = new Order({
        userId: user._id,
        productId: product._id,
        merchantId: merchantId,
        total: total,
        status: paymentStatus,
        invoiceNumber: invoiceNumber,
        paypalInfo: paypalInfo,
    });
    try {
        const savedOrder = await newOrder.save();
        return res.status(200).json(CreateSuccess(savedOrder));
    } catch (error) {
        return res.status(500).json(CreateError(error));
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