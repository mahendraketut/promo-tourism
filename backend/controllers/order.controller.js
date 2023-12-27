import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { CreateSuccess } from '../utils/success.js';
import { CreateError } from '../utils/error.js';

//Creates a new order.
//We need the user's ID, product ID, total, quantity purchased, merchant ID, and payment information from paypal.
export const createOrder = async (req, res) => {
    //Finds the user and the product according to the ID supplied from the front-end.
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json(CreateError('User not found'));
    const product = await Product.findById(req.body.productId);
    if(!product) return res.status(404).json(CreateError('Product not found'));
    //Gets important parameters from the request body.
    const total = req.body.total;
    const invoiceNumber = req.body.invoice;
    const paypalInfo = req.body.paypalInfo;
    const merchantId = product.owner;
    const paymentStatus = req.body.paymentStatus;
    //Final check to ensure that the quantity of the product ordered must be less than what is available.
    if(product.quantity < req.body.quantity) return res.status(404).json(CreateError(200, 'Product quantity is not enough', product.quantity));
    //Creates a new order.
    const newOrder = new Order({
        userId: user._id,
        productId: product._id,
        merchantId: merchantId,
        total: total,
        status: paymentStatus,
        invoiceNumber: invoiceNumber,
        paypalInfo: paypalInfo,
    });
    //Updates the product quantity on the database to reflect the purchase.
    product.quantity = product.quantity - req.body.quantity;  
    product.sold = product.sold + req.body.quantity;
    //Saves the order and the product to the database.
    try {
        const savedOrder = await newOrder.save();
        await product.save();
        return res.status(200).json(CreateSuccess(200, "Order created", savedOrder));
    } catch (error) {
        return res.status(500).json(CreateError(500, "Cannot create order", error))
    }
};

//Retreives all orders from the database.
//Used by admin/officer to view all orders.
//No filtering is done here
export const getOrders = async (req, res) => {  
    try {
        const orders = await Order.find();
        return res.status(200).json(CreateSuccess(200, "success", orders));
    } catch (error) {
        return res.status(500).json(CreateError(500,"Cannot get order", error));
    }
};

//Retreives a specific order from the database according to the ID supplied.
//Can be used by all users to retreive an order.
export const getOrderById = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await Order.findById(orderId);
        return res.status(200).json(CreateSuccess(200, "success", order));
    } catch (error) {
        return res.status(500).json(CreateError(error(500, "Cannot get order", error)));
    }
};

//Retreives all orders from the database according to the user ID supplied.
//Used by Users to view their past orders.
//Filters product by userId.
export const getOrderbyUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const order = await Order.find({userId: userId});
        return res.status(200).json(CreateSuccess(order));
    } catch (error) {
        return res.status(500).json(CreateError(error));
    }
};

//Retreives all orders from the database according to the Merchan ID supplied.
//Used by Merchants to view orders made to their products.
//Filters product by merchantId.
export const getOrderByMerchantId = async (req, res) => {
    const { merchantId } = req.params;
    try {
        const order = await Order.find({merchantId: merchantId});
        return res.status(200).json(CreateSuccess(200, "success",order));
    } catch (error) {
        return res.status(500).json(CreateError(500, "Cannot get order",error));
    }
}

//Check to see if a product listed in an order has been reviewed.
//Retreives the order according to the ID supplied.
//then checks if the product has been reviewed.
//Returns true (code 200) if it has been reviewed, false if not.
export const hasReviewed = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await Order.findById(orderId);
        if (order.hasReviewed == true ){
            return res.status(200).json(CreateSuccess(200, "success", order.hasReview));
        }
        return res.status(200).json(CreateSuccess(404, "false", order.hasReview));
    } catch (error) {
        return res.status(500).json(CreateError(500, "Cannot get order", error));
    }
}