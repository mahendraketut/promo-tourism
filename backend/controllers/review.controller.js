import Review from '../models/Review.js';
import Order from '../models/Order.js';
import { CreateSuccess } from '../utils/success.js';
import { CreateError } from '../utils/error.js';


//Creates a new review to a certain product from a specific order.
export const createReview = async (req, res) => {
    const review = new Review({
        userId: req.body.userId,
        productId: req.body.productId,
        orderId: req.body.orderId,
        rating: req.body.rating,
        comment: req.body.comment,
    });
    //Finds the order first.
    const order = await Order.findOne({ _id: req.body.orderId });
    if(!order) return res.status(404).json(CreateError(404, "Order not found"));
    //Changes the order status to reviewed.
    order.hasReviewed = true;
    //Saves the order to the database.
    try {
        await order.save();
    } catch (error) {
        return res.status(500).json(CreateError(500, "Cannot update order", error));
    }
    //Saves the new review to the database.
    try {
        const savedReview = await review.save();
        return res.status(200).json(CreateSuccess(200, "Review created", savedReview));
    } catch (error) {
        return res.status(500).json(CreateError(500, "Cannot create review", error));
    }
}

//Retreives all reviews according to the product ID supplied.
//Used by all users to view reviews of a certain product.
//Filters the reviews by productId.
export const getReviewByProduct = async (req, res) =>  {
    try {
        const reviews = await Review.find({ productId: req.params.id });
        return res.status(200).json(CreateSuccess(200, "Get reviews by product id", reviews));
    } catch (error) {
        return res.status(500).json(CreateError(500, "Cannot get reviews by product id", error));
    }
}

//Retreives a specific review according to the review ID supplied.
//Used by all users to view a specific review.
export const getReviewById = async (req, res) => {
    try {
        const review = await Review.findOne({ _id: req.params.id });
    } catch (error) {
        return res.status(500).json(CreateError(500, "Cannot get review by id", error));
    }
}

//Retreives a specific review according to the order ID supplied.
//Used by all users to view a specific review from a specific order.
export const getReviewByOrder = async (req, res) => {
    try {
        const review = await Review.findOne({ orderId: req.params.id });
    } catch (error) {
        return res.status(500).json(CreateError(500, "Cannot get review by order id", error));
    }
}

//Retreives the average review of a product according to the product ID supplied.
//Used by all users to view the average review of a product.
export const getReviewAverageByProduct = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.id });
        let totalRating = 0;
        reviews.forEach(review => {
            totalRating += review.rating;
        });
        const averageRating = totalRating / reviews.length;
        return res.status(200).json(CreateSuccess(200, "Get average review by product id", averageRating));
    } catch (error) {
        return res.status(500).json(CreateError(500, "Cannot get average review by product id", error));
    }
}