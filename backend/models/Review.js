//This is the model for Review.

import mongoose from 'mongoose';

export const reviewSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Order',
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
    }
}, {
    timestamps: true,
});


export default mongoose.model('Review', reviewSchema);