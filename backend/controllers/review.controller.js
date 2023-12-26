import Review from '../models/Review.js';
import Order from '../models/Order.js';
import { CreateSuccess } from '../utils/success.js';
import { CreateError } from '../utils/error.js';



export const createReview = async (req, res) => {
    console.log("masuk create review oi");
    console.log("req: ", req.body);
    const review = new Review({
        userId: req.body.userId,
        productId: req.body.productId,
        orderId: req.body.orderId,
        rating: req.body.rating,
        comment: req.body.comment,
    });

    const order = await Order.findOne({ _id: req.body.orderId });
    if(!order) return res.status(404).json(CreateError(404, "Order not found"));
    order.hasReviewed = true;
    try {
        console.log("saving order");
        const savedOrder = await order.save();
        console.log("saved order: ", savedOrder);
    } catch (error) {
        return res.status(500).json(CreateError(500, "Cannot update order", error));
    }

    try {
        const savedReview = await review.save();
        return res.status(200).json(CreateSuccess(200, "Review created", savedReview));
    } catch (error) {
        return res.status(500).json(CreateError(500, "Cannot create review", error));
    }


}

export const getReviewByProduct = async (req, res) =>  {
    try {
        const reviews = await Review.find({ productId: req.params.id });
        return res.status(200).json(CreateSuccess(200, "Get reviews by product id", reviews));
    } catch (error) {
        return res.status(500).json(CreateError(500, "Cannot get reviews by product id", error));
    }
}


export const getReviewById = async (req, res) => {
    try {
        const review = await Review.findOne({ _id: req.params.id });
    } catch (error) {
        return res.status(500).json(CreateError(500, "Cannot get review by id", error));
    }
}


export const getReviewByOrder = async (req, res) => {
    try {
        const review = await Review.findOne({ orderId: req.params.id });
    } catch (error) {
        return res.status(500).json(CreateError(500, "Cannot get review by order id", error));
    }
}


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